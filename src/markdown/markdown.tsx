import React, { useState, useCallback, useRef, useEffect } from 'react'
import './theme/global.css'
import './theme/purple.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { MarkdownEditContainer } from './style'
import showdown from 'showdown'
import setOptions from './options'
import NavBar from 'src/components/navbar/index'
import 'antd/dist/antd.css';

const converter = new showdown.Converter()  // showdown.js的实例对象
setOptions(converter)
console.log(converter.getOptions());

let scrolling: 0 | 1 | 2 = 0   // 当前滚动块。0: both none ; 1: edit ; 2: show
let scrollTimer: any;  // 改变scrolling值得定时器

export default function MarkdownEdit() {
    const editRef = useRef<any>(null)
    const showRef = useRef<any>(null)
    const [value, setValue] = useState('')  // 编辑框里输入的内容
    const [htmlString, setHtmlString] = useState('')    // 渲染对应的htmlString  
    
    // markdown解析函数
    const parse = useCallback((text) => setHtmlString(converter.makeHtml(text)), [])

    // 编辑区内容改变
    const editChange = useCallback((event) => {
        let value = event.target.value
        
        setValue(value)
        parse(value)
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

    useEffect(() => {
        // 检测页面代码块并标记高亮
        hljs.highlightAll()
    }, [htmlString])

    return (
        <MarkdownEditContainer>
            <NavBar/>
            <main className="markdown-main">
                <textarea 
                    className="edit" 
                    ref={editRef}
                    onChange={editChange}
                    onScroll={handleScroll}
                    value={value}
                />
                <div 
                    id="write"
                    className="show" 
                    ref={showRef}
                    onScroll={handleScroll}
                    dangerouslySetInnerHTML={{ __html: htmlString }}
                />
            </main>
        </MarkdownEditContainer>
    )
}
