import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Spin } from 'antd'
import { MarkdownEditContainer } from './style/style'
import NavBar from './navbar/index'
import 'antd/dist/antd.css';
import './style/global.css'
import { 
    getCursorPosition, setSelectionRange, handleTwoSideSymbol,
    addTable, addCodeBlock, addLink, addPhoto, addList, addTitle,
    addQuote, 
} from './utils'
import md from './markdown'
import { PropsType, historyLinkType } from './types'
import { log } from 'console';

let scrolling: 0 | 1 | 2 = 0   // 当前滚动块。0: both none ; 1: edit ; 2: show
let scrollTimer: any;  // 改变scrolling值得定时器
let historyTimer: any;  // 记录历史输入内容的定时器
let mkRenderTimer: any;  // markdown渲染的定时器
let historyLink: historyLinkType = { value: '', pre: null, next: null, selectionStart: 0, selectionEnd: 0 }   // 存储表单历史输入内容的双向链表

export default function MarkdownEdit(props: PropsType) {
    const editRef = useRef<any>(null)
    const showRef = useRef<any>(null)
    const [value, setValue] = useState(props.initValue ? props.initValue : '')  // 编辑框里输入的内容
    const [htmlString, setHtmlString] = useState('')    // 渲染对应的htmlString  
    const [fullScreen, setFullScreen] = useState(false)  // 展示区是否全屏
    const [loading, setLoading] = useState(true)  // 展示区是否正在加载中

    // 区间进行滚动
    const handleScroll = useCallback((event) => {
        let { target } = event
        let scale = getScale(target)
 
        if(target.nodeName === 'TEXTAREA') {
            if(scrolling === 0) scrolling = 1;
            else if(scrolling === 2) return;    // 当前是「展示区」主动触发的滚动，因此不需要再驱动展示区去滚动
            // 驱动「展示区」同步滚动   
            driveScroll(scale, showRef.current)
        } else {
            if(scrolling === 0) scrolling = 2;
            else if(scrolling === 1) return;
            driveScroll(scale, editRef.current)
        }
    }, [])

    // 驱动元素进行滚动
    const driveScroll = useCallback((scale: number, el: HTMLElement) => {
        let { scrollHeight, clientHeight } = el
        el.scrollTop = (scrollHeight - clientHeight) * scale

        if(scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            scrolling = 0
            clearTimeout(scrollTimer)
        }, 200)
    }, [])

    // 获取滚动比例
    const getScale = useCallback((el: HTMLElement) => {
        let { scrollHeight, scrollTop, clientHeight } = el
        return scrollTop / (scrollHeight - clientHeight)
    }, [])

    // 控制键盘的按键
    const handleKeyUp = (event: any) => {
        let { keyCode, metaKey, ctrlKey, altKey, shiftKey } = event
        let el = editRef.current
        let [start, end] = getCursorPosition(el)

        if(metaKey || ctrlKey) {  // ctrl 开头的组合按键
            if(altKey) {
                if(keyCode === 84) {  // ctrl + alt + t 表格
                    addTable(editRef.current, wrapSetValue, value)
                    event.preventDefault()
                } else if(keyCode === 67) {  // ctrl + alt + c 代码块
                    addCodeBlock(editRef.current, wrapSetValue, value, '')
                    event.preventDefault()
                } else if(keyCode === 86) {   // ctrl + alt + v  行内代码
                    handleTwoSideSymbol(editRef.current, wrapSetValue, value, '`', "行内代码")
                    event.preventDefault()
                } else if(keyCode === 76) {  // ctrl + alt + l  图片链接格式
                    addPhoto(editRef.current, wrapSetValue, value)
                    event.preventDefault()
                } else if(keyCode === 85) {   // ctrl + alt + u  无序列表
                    addList(editRef.current, wrapSetValue, value, '-', '无序列表')
                    event.preventDefault()
                }
            } else {
                if(keyCode === 90) {  // ctrl + z 撤销
                    if(!historyLink.pre) return event.preventDefault();
                    let { value, selectionStart, selectionEnd } = historyLink.pre
                    setValue(value)
                    historyLink = historyLink.pre
                    setSelectionRange(el, selectionStart, selectionEnd)
                    event.preventDefault()
                } else if(keyCode === 89) {  // ctrl + Y 前进
                    if(!historyLink.next) return event.preventDefault();
                    let { value, selectionStart, selectionEnd } = historyLink.next
                    setValue(value)
                    historyLink = historyLink.next
                    setSelectionRange(el, selectionStart, selectionEnd)
                    event.preventDefault()
                } else if(keyCode === 66) {   // ctrl + b 加粗
                    handleTwoSideSymbol(editRef.current, wrapSetValue, value, '**', "加粗字体")
                    event.preventDefault()
                } else if(keyCode === 73) {   // ctrl + i 斜体
                    handleTwoSideSymbol(editRef.current, wrapSetValue, value, '*', "倾斜字体")
                    event.preventDefault()
                } else if(keyCode === 85) {  // ctrl + u 删除线
                    handleTwoSideSymbol(editRef.current, wrapSetValue, value, '~~', "删除文本")
                    event.preventDefault()
                } else if(keyCode === 76) {   // ctrl + l 链接
                    addLink(editRef.current, wrapSetValue, value)
                    event.preventDefault()
                } else if(keyCode === 79) {   // ctrl + o  无序列表
                    addList(editRef.current, wrapSetValue, value, '1.', '有序列表')
                    event.preventDefault()
                } else if(keyCode === 81) {   // ctrl + q  引用 （有点问题）
                    addQuote(editRef.current, wrapSetValue, value)
                    event.preventDefault()
                } else if(keyCode === 49) {   // ctrl + 1  一级标题
                    addTitle(editRef.current, wrapSetValue, value, '#', "一级标题")
                    event.preventDefault()
                } else if(keyCode === 50) {   // ctrl + 2  二级标题
                    addTitle(editRef.current, wrapSetValue, value, '##', "二级标题")
                    event.preventDefault()
                } else if(keyCode === 51) {   // ctrl + 3  三级标题
                    addTitle(editRef.current, wrapSetValue, value, '###', "三级标题")
                    event.preventDefault()
                } else if(keyCode === 52) {   // ctrl + 4  四级标题
                    addTitle(editRef.current, wrapSetValue, value, '####', "四级标题")
                    event.preventDefault()
                } else if(keyCode === 53) {   // ctrl + 5  五级标题
                    addTitle(editRef.current, wrapSetValue, value, '#####', "五级标题")
                    event.preventDefault()
                } else if(keyCode === 54) {   // ctrl + 6  六级标题
                    addTitle(editRef.current, wrapSetValue, value, '######', "六级标题")
                    event.preventDefault()
                }
            }
        } else if(shiftKey) {   // shift 开头的组合按键
            if(keyCode === 9) {   // shift + tab 取消缩进
                let paragraph = value.split('\n'),
                    stringCount = 0,
                    selectionStart = start, 
                    selectionEnd = end,
                    len = paragraph.length,
                    cancelSpaceCount = 0
                
                for(let i = 0; i < len; i++) {
                    let item = paragraph[i]
                    let nextStringCount = stringCount + item.length + 1
                    
                    // 判断选中的段落的前缀是否有4个空格并去除空格进行缩进
                    if(nextStringCount > start && stringCount < end) {
                        let spaces = item.split('    ')  // 判断有多少4个空格
                        // 去前缀空格
                        if(spaces.length !== 1) {
                            spaces.shift();
                            cancelSpaceCount += 4
                        }
                        else {
                            cancelSpaceCount += spaces[0].length
                            spaces[0] = spaces[0].trimLeft();
                            cancelSpaceCount -= spaces[0].length
                        }

                        let newParagraph = spaces.join('    ')
                        paragraph[i] = newParagraph
                        // 获取取消缩进后的光标开始位置和结束位置
                        if(start > stringCount) selectionStart -= item.length - newParagraph.length;
                        if(end < nextStringCount) selectionEnd -= cancelSpaceCount         
                    } else if(stringCount > end) break;            

                    stringCount = nextStringCount
                }

                let newValue = paragraph.join('\n')

                wrapSetValue(newValue, selectionStart, selectionEnd)
                setSelectionRange(el, selectionStart, selectionEnd)
                event.preventDefault()
            }
        } else {   // 单个按键
            if(keyCode === 9) {  // Tab缩进
                let paragraph = value.split('\n'),
                    stringCount = 0,
                    selectionStart = start, 
                    selectionEnd = end,
                    len = paragraph.length,
                    addlSpaceCount = 0,
                    newValue = ''
                
                // 光标未选中文字
                if(start === end) {
                    console.log(start, end);
                    
                    newValue = value.slice(0, start) + '    ' + value.slice(end);
                    selectionStart += 4
                    selectionEnd += 4
                } else {   //  光标选中了文字
                    for(let i = 0; i < len; i++) {
                        let item = paragraph[i]
                        let nextStringCount = stringCount + item.length + 1
                        
                        // 将选中的每段段落前面加4个空格
                        if(nextStringCount > start && stringCount < end) {
                            let newParagraph = '    ' + item
                            addlSpaceCount += 4
                            paragraph[i] = newParagraph
                            // 获取取消缩进后的光标开始位置和结束位置
                            if(start > stringCount) selectionStart += 4;
                            if(end < nextStringCount) selectionEnd += addlSpaceCount         
                        } else if(stringCount > end) break;            
    
                        stringCount = nextStringCount
                    }
                    newValue = paragraph.join('\n')
                }
                
                wrapSetValue(newValue, selectionStart, selectionEnd)
                setSelectionRange(el, selectionStart, selectionEnd)
                event.preventDefault()
            }
        }
    }

    // 包装过后的setValue
    const wrapSetValue = useCallback((event, start?: number, end?: number) => {
        let value = event;
        let selectionStart = start as number
        let selectionEnd = end as number
        if(typeof event !== 'string') {
            value = event.target.value
            let [start, end] = getCursorPosition(event.target)
            selectionStart = start
            selectionEnd = end 
        }
        
        setValue(value)

        if(historyTimer) clearTimeout(historyTimer);
        historyTimer = setTimeout(() => {
            historyLink.next = {
                value,
                pre: historyLink,
                next: null,
                selectionStart,
                selectionEnd
            }
            historyLink = historyLink.next
            clearTimeout(historyTimer)
        }, 1000)
    }, [])

    // value改变，驱动htmlString的改变
    useEffect(() => {
        if(mkRenderTimer) clearTimeout(mkRenderTimer);
        mkRenderTimer = setTimeout(() => setHtmlString(md.render(value)), 200)         
    }, [value])

    useEffect(() => {
        // 设置历史记录的初始状态
        historyLink.value = props.initValue ? props.initValue : ''
    }, [])

    return (
        <MarkdownEditContainer>
            <NavBar
                value={value}
                editElement={editRef}
                setValue={wrapSetValue}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
                setLoading={setLoading}
            />
            <Spin 
                spinning={loading} 
                wrapperClassName="write-spin" 
                tip="更新主题中..."
            >
                <main className="markdown-main">
                    <textarea 
                        id="markdown-editor-reactjs-edit"
                        className={`${fullScreen ? 'hide' : ''}`} 
                        ref={editRef}
                        onChange={wrapSetValue}
                        onScroll={handleScroll}
                        onKeyDown={handleKeyUp}
                        value={value}
                    />
                    <div 
                        id="write"
                        className={`${fullScreen ? 'fullScreen': ''}`}
                        ref={showRef}
                        onScroll={handleScroll}
                        dangerouslySetInnerHTML={{ __html: htmlString }}
                    />
                </main>
            </Spin>
        </MarkdownEditContainer>
    )
}
