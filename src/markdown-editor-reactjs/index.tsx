import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Spin } from 'antd'
import { MarkdownEditContainer } from './style/style'
import NavBar from './navbar/index'
import 'antd/dist/antd.css';
import './style/global.css'
import { getCursorPosition, setSelectionRange } from './utils'
import md from './markdown'
import { PropsType, historyLinkType } from './types'

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
        let { keyCode, metaKey, ctrlKey } = event
        let el = editRef.current
        let [start, end] = getCursorPosition(el)

        if(metaKey || ctrlKey) {  // 组合按键
            if(keyCode === 90) {  // ctrl + z 撤销
                if(!historyLink.pre) return;
                let { value, selectionStart, selectionEnd } = historyLink.pre
                setValue(value)
                historyLink = historyLink.pre
                setSelectionRange(el, selectionStart, selectionEnd)
                event.preventDefault()
            }
        } else {   // 单个按键
            if(keyCode === 9) {  // Tab缩进
                let newValue = value.slice(0, start) + '    ' + value.slice(start)

                let selectionStart = start + 4
                let selectionEnd = end + 4

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
