import React, { useState, useCallback, useRef, useEffect } from 'react'
import './theme/global.css'
import './theme/orangeheart.css'
import { Spin } from 'antd'
import { MarkdownEditContainer } from './style/style'
import NavBar from 'src/components/navbar/index'
import 'antd/dist/antd.css';
import './style/global.css'
import md from './markdown'

let scrolling: 0 | 1 | 2 = 0   // 当前滚动块。0: both none ; 1: edit ; 2: show
let scrollTimer: any;  // 改变scrolling值得定时器

export default function MarkdownEdit() {
    const editRef = useRef<any>(null)
    const showRef = useRef<any>(null)
    const [value, setValue] = useState('')  // 编辑框里输入的内容
    const [htmlString, setHtmlString] = useState('')    // 渲染对应的htmlString  
    const [fullScreen, setFullScreen] = useState(false)  // 展示区是否全屏
    const [loading, setLoading] = useState(true)  // 展示区是否正在加载中

    // markdown解析函数
    const parse = useCallback((text) => setHtmlString(md.render(text)), [])

    // 编辑区内容改变
    const editChange = useCallback((event, value?: string) => {
        let newValue;

        if(event) newValue = event.target.value;
        else newValue = value

        setValue(newValue)
        parse(newValue)
    }, [])

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

    return (
        <MarkdownEditContainer>
            <NavBar
                value={value}
                editElement={editRef}
                editChange={editChange}
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
                        onChange={editChange}
                        onScroll={handleScroll}
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
