import React, { useState, useCallback, useRef, useEffect, useReducer } from 'react'
import { Spin } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import './style/index.less'
import NavBar from './navbar/index'
import 'antd/dist/antd.css';
import './style/global.css'
import './style/toc.less'
import { 
    getCursorPosition, setSelectionRange, handleTwoSideSymbol,
    addTable, addCodeBlock, addLink, addPhoto, addList, addTitle,
    addQuote, recordCursorHistoryByElement, recordCursorHistoryByPosition,
} from './utils'
import md from './markdown'
import { PropsType, HistoryLinkType, ModeType, StateType } from './types'
import { INDENTATION } from './const'

let scrolling: 0 | 1 | 2 = 0   // 当前滚动块。0: both none ; 1: edit ; 2: show
let scrollTimer: any;  // 改变scrolling值得定时器
let historyTimer: any;  // 记录历史输入内容的定时器
let mkRenderTimer: any;  // markdown渲染的定时器
let historyLink: HistoryLinkType = { value: '', pre: null, next: null, selectionStart: 0, selectionEnd: 0 }  

type ReducerType = (
    state: StateType,
    { type, payload }: { type: string, payload?: any }
) => StateType;

const reducer: ReducerType = ( state, { type, payload } ) => {
    switch(type) {
        case 'toggleMode':
            return { ...state, mode: payload };
        case 'toggleLoading':
            return { ...state, loading: payload };
        case 'changeHtmlString':
            return { ...state, htmlString: payload };
        case 'toggleTOC':
            return { ...state, showTOC: typeof payload === 'undefined' ? !state.showTOC : payload };
        case 'changeTOC':
            return { ...state, toc: payload }
    }
    return state
}

const MarkdownEdit : React.FC<PropsType> = (props) => {
    const { 
        value, 
        setValue,
        mode = ModeType.NORMAL,
        showTOC = true,
    } = props
    const [state, dispatch] = useReducer<ReducerType, StateType>(
        reducer, 
        {
            htmlString: '',
            mode,
            loading: true,
            showTOC,
            toc: '<p></p><h3>目录</h3>',
        }, 
        (initState: StateType) => initState
    );
    const editRef = useRef<any>(null)
    const showRef = useRef<any>(null) 
    
    // 区间进行滚动
    const handleScroll = useCallback((event) => {
        // 若编辑区和展示区没有同时出现，则无序同步滚动
        if(state.mode !== ModeType.NORMAL) return;

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
    }, [state.mode])

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
                    addTable(editRef.current, setValue, value)
                    event.preventDefault()
                } else if(keyCode === 67) {  // ctrl + alt + c 代码块
                    addCodeBlock(editRef.current, setValue, value, '')
                    event.preventDefault()
                } else if(keyCode === 86) {   // ctrl + alt + v  行内代码
                    handleTwoSideSymbol(editRef.current, setValue, value, '`', "行内代码")
                    event.preventDefault()
                } else if(keyCode === 76) {  // ctrl + alt + l  图片链接格式
                    addPhoto(editRef.current, setValue, value)
                    event.preventDefault()
                } else if(keyCode === 85) {   // ctrl + alt + u  无序列表
                    addList(editRef.current, setValue, value, '-', '无序列表')
                    event.preventDefault()
                }
            } else {
                if(keyCode === 90) {  // ctrl + z 撤销
                    if(!historyLink.pre) return;
                    else {
                        let { value, selectionStart, selectionEnd } = historyLink.pre
                        setValue(value)
                        historyLink = historyLink.pre
                        setSelectionRange(el, selectionStart, selectionEnd)
                    }
                    event.preventDefault()
                } else if(keyCode === 89) {  // ctrl + Y 前进
                    if(!historyLink.next) return;
                    else {
                        let { value, selectionStart, selectionEnd } = historyLink.next
                        setValue(value)
                        historyLink = historyLink.next
                        setSelectionRange(el, selectionStart, selectionEnd)
                    }
                    event.preventDefault()
                } else if(keyCode === 66) {   // ctrl + b 加粗
                    handleTwoSideSymbol(editRef.current, setValue, value, '**', "加粗字体")
                    event.preventDefault()
                } else if(keyCode === 73) {   // ctrl + i 斜体
                    handleTwoSideSymbol(editRef.current, setValue, value, '*', "倾斜字体")
                    event.preventDefault()
                } else if(keyCode === 85) {  // ctrl + u 删除线
                    handleTwoSideSymbol(editRef.current, setValue, value, '~~', "删除文本")
                    event.preventDefault()
                } else if(keyCode === 76) {   // ctrl + l 链接
                    addLink(editRef.current, setValue, value)
                    event.preventDefault()
                } else if(keyCode === 79) {   // ctrl + o  无序列表
                    addList(editRef.current, setValue, value, '1.', '有序列表')
                    event.preventDefault()
                } else if(keyCode === 81) {   // ctrl + q  引用 （有点问题）
                    addQuote(editRef.current, setValue, value)
                    event.preventDefault()
                } else if(keyCode === 49) {   // ctrl + 1  一级标题
                    addTitle(editRef.current, setValue, value, '#', "一级标题")
                    event.preventDefault()
                } else if(keyCode === 50) {   // ctrl + 2  二级标题
                    addTitle(editRef.current, setValue, value, '##', "二级标题")
                    event.preventDefault()
                } else if(keyCode === 51) {   // ctrl + 3  三级标题
                    addTitle(editRef.current, setValue, value, '###', "三级标题")
                    event.preventDefault()
                } else if(keyCode === 52) {   // ctrl + 4  四级标题
                    addTitle(editRef.current, setValue, value, '####', "四级标题")
                    event.preventDefault()
                } else if(keyCode === 53) {   // ctrl + 5  五级标题
                    addTitle(editRef.current, setValue, value, '#####', "五级标题")
                    event.preventDefault()
                } else if(keyCode === 54) {   // ctrl + 6  六级标题
                    addTitle(editRef.current, setValue, value, '######', "六级标题")
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
                    
                    // 判断选中的段落的前缀是否有缩进空格并去除空格进行缩进
                    if(nextStringCount > start && stringCount < end) {
                        let spaces = item.split(' '.repeat(INDENTATION))  // 判断有多少个缩进字符
                        // 去前缀空格
                        if(spaces.length !== 1) {
                            spaces.shift();
                            cancelSpaceCount += INDENTATION
                        }
                        else {
                            cancelSpaceCount += spaces[0].length
                            spaces[0] = spaces[0].trimLeft();
                            cancelSpaceCount -= spaces[0].length
                        }

                        let newParagraph = spaces.join(' '.repeat(INDENTATION))
                        paragraph[i] = newParagraph
                        // 获取取消缩进后的光标开始位置和结束位置
                        if(start > stringCount) selectionStart -= item.length - newParagraph.length;
                        if(end < nextStringCount) selectionEnd -= cancelSpaceCount         
                    } else if(stringCount > end) break;            

                    stringCount = nextStringCount
                }

                let newValue = paragraph.join('\n')

                setValue(newValue)
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
                    newValue = value.slice(0, start) + ' '.repeat(INDENTATION) + value.slice(end);
                    selectionStart += INDENTATION
                    selectionEnd += INDENTATION
                } else {   //  光标选中了文字
                    for(let i = 0; i < len; i++) {
                        let item = paragraph[i]
                        let nextStringCount = stringCount + item.length + 1
                        
                        // 将选中的每段段落前缩进
                        if(nextStringCount > start && stringCount < end) {
                            let newParagraph = ' '.repeat(INDENTATION) + item
                            addlSpaceCount += INDENTATION
                            paragraph[i] = newParagraph
                            // 获取取消缩进后的光标开始位置和结束位置
                            if(start > stringCount) selectionStart += INDENTATION;
                            if(end < nextStringCount) selectionEnd += addlSpaceCount         
                        } else if(stringCount > end) break;            
    
                        stringCount = nextStringCount
                    }
                    newValue = paragraph.join('\n')
                }
                
                setValue(newValue)
                setSelectionRange(el, selectionStart, selectionEnd)
                event.preventDefault()
            }
        }
    }

    // 编辑区的点击事件
    const editClick = useCallback((e) => {
        recordCursorHistoryByElement(historyLink, e.target)
    }, [])

    // value改变时做的一些操作
    useEffect(() => {
        // value改变，驱动htmlString的改变
        if(mkRenderTimer) clearTimeout(mkRenderTimer);
        mkRenderTimer = setTimeout(() => {
            // 带上目录一起渲染
            let htmlString_withTOC = md.render(`@[toc](目录)\n${value}`)
            
            let rst = new RegExp(/^<p>.*<\/p>/).exec(htmlString_withTOC)
            let toc = rst ? rst[0] : ''
            let htmlString = htmlString_withTOC.slice(toc.length, -1)
            
            dispatch({ type: 'changeHtmlString', payload: htmlString })
            dispatch({ type: 'changeTOC', payload: toc ? toc : '<p><h3>目录</h3></p>' })
            clearTimeout(mkRenderTimer)
        }, 200) 
        
        // 记录历史记录
        let [selectionStart, selectionEnd] = getCursorPosition(editRef.current)
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
    }, [value])

    // 初始化
    useEffect(() => {
        // 设置历史记录的初始状态
        historyLink.value = value
        // 初始化编辑区内容
        setValue(value)
        // 初次进入聚焦编辑区
        let totalLen = value.length
        setSelectionRange(editRef.current, totalLen, totalLen)
        recordCursorHistoryByPosition(historyLink, totalLen, totalLen)
    }, [])

    return (
        <div className="__markdown-editor-reactjs-container">
            {
                state.mode !== ModeType.EXHIBITION &&
                <NavBar
                    value={value}
                    state={state}
                    dispatch={dispatch}
                    editElement={editRef}
                    setValue={setValue}
                />
            }
            <Spin 
                spinning={state.loading} 
                wrapperClassName="write-spin" 
                tip="更新主题中..."
            >
                <main className="__markdown-editor-reactjs-markdown-main">
                    {   
                        // 编辑区
                        (state.mode === ModeType.NORMAL || state.mode === ModeType.EDIT) &&
                        <textarea 
                            id="__markdown-editor-reactjs-edit"
                            ref={editRef}
                            onClick={editClick}
                            onChange={e => setValue(e.target.value)}
                            onScroll={handleScroll}
                            onKeyDownCapture={handleKeyUp}
                            value={value}
                        />
                    }
                    {
                        // 展示区
                        state.mode !== ModeType.EDIT &&
                        <div 
                            id="write"
                            ref={showRef}
                            onScroll={handleScroll}
                            dangerouslySetInnerHTML={{ __html: state.htmlString }}
                        />
                    }
                    {
                        // 目录
                        state.showTOC &&
                        <section className="__markdown-editor-reactjs-toc-layout">
                            <CloseOutlined className="toc-close-icon" onClick={() => dispatch({ type: 'toggleTOC', payload: false })}/>
                            <div
                                id="__markdown-editor-reactjs-toc"
                                dangerouslySetInnerHTML={{ __html: state.toc }}
                            />
                        </section>
                    }
                </main>
            </Spin>
        </div>
    )
}

export default MarkdownEdit
