import { HistoryLinkType } from './types'

// 生成哈希串
export function hash(len: number = 10) {
    return  Math.random().toString(36).substr(2, len);
}

// 进行一些操作前的判断逻辑（全屏模式下不该执行的操作）
export function shouldImplementInFullScreen () {
    
}

// 获取光标位置
export function getCursorPosition(el: HTMLTextAreaElement) {
    let { selectionStart, selectionEnd } = el
    
    return [selectionStart, selectionEnd]
}

// 设置光标位置
export function setSelectionRange(el: HTMLTextAreaElement, selectionStart: number, selectionEnd: number, isFocus: boolean = true) {
    let timer = setTimeout(() => {
        if(isFocus) {
            let { scrollTop } = el
            el.focus();
            el.scrollTop = scrollTop   // 保持聚焦后页面不滚动到底部
        }
        el.setSelectionRange(selectionStart, selectionEnd)   // 光标选中指定的文本
        clearTimeout(timer)
    }, 0)
}

// 通过当前元素的光标位置记录光标的历史位置
export function recordCursorHistoryByElement (historyLink: HistoryLinkType, el: HTMLTextAreaElement) {
    let [selectionStart, selectionEnd] = getCursorPosition(el)
    historyLink.selectionStart = selectionStart
    historyLink.selectionEnd = selectionEnd
}

// 通过指定的光标位置记录光标的历史位置
export function recordCursorHistoryByPosition (historyLink: HistoryLinkType, selectionStart: number, selectionEnd: number) {
    historyLink.selectionStart = selectionStart
    historyLink.selectionEnd = selectionEnd
}

// 控制两边加符号的语法，例如：**粗体**、*斜体*、~~删除文本~~ 等等
export function handleTwoSideSymbol (el: HTMLTextAreaElement, setValue: Function, value: string, symbol: string, txt: string) {
    let [start, end] = getCursorPosition(el)

    let newValue = start === end
                    ? value.slice(0, start) + `${symbol}${txt}${symbol}` + value.slice(end)
                    : value.slice(0, start) + symbol + value.slice(start, end) + symbol + value.slice(end)
    
    let selectionStart = start + symbol.length
    let selectionEnd = start === end ? end + symbol.length + txt.length : end + symbol.length

    setSelectionRange(el, selectionStart, selectionEnd)  // 选中加粗的文本
    setValue(newValue)
}

// 添加列表语法，例如：- 无序列表、1. 有序列表、- [x] 任务列表 等等
export function addList (el: HTMLTextAreaElement, setValue: Function, value: string, symbol: string, txt: string) {
    let [start, end] = getCursorPosition(el)

    let newValue = start === end
                    ? `${value.slice(0, start)}\n${symbol} ${txt}\n${value.slice(end)}`
                    : `${value.slice(0, start)}\n${symbol} ${value.slice(start, end)}\n${value.slice(end)}`

    let selectionStart = start + 2 + symbol.length
    let selectionEnd = start === end ? end + 2 + symbol.length + txt.length : end + 2 + symbol.length
   
    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(newValue)
}

// 添加代码块
export function addCodeBlock (el: HTMLTextAreaElement, setValue: Function, value: string, language: string) {
    let [start, end] = getCursorPosition(el)

    let newValue = start === end
                    ? `${value.slice(0, start)}\n\`\`\`${language}\n\n\`\`\`\n${value.slice(end)}`
                    : `${value.slice(0, start)}\n\`\`\`${language}\n${value.slice(start, end)}\n\`\`\`\n${value.slice(end)}`
    
    let selectionStart = end + 5 + language.length
    let selectionEnd = end + 5 + language.length
    
    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(newValue)
}

// 添加链接
export function addLink (el: HTMLTextAreaElement, setValue: Function, value: string)  {
    let [start, end] = getCursorPosition(el)
    let newValue = start === end
                    ? `${value.slice(0, start)}[链接描述文字](url)${value.slice(end)}`
                    : `${value.slice(0, start)}[${value.slice(start, end)}](url)${value.slice(end)}`

    let selectionStart = start === end ? start + 9 : end + 3
    let selectionEnd = start === end ? end + 12 : end + 6
    
    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(newValue)
}

// 添加表格
export function addTable (el: HTMLTextAreaElement, setValue: Function, value: string) {
    let [start, end] = getCursorPosition(el)
    let newValue = start === end
                    ? `${value.slice(0, start)}\n|  |  |\n|---|---|\n|  |  |${value.slice(end)}`
                    : `${value.slice(0, start)}\n| ${value.slice(start, end)} |  |\n|---|---|\n|  |  |${value.slice(end)}`

    let selectionStart = start + 3
    let selectionEnd = end + 3

    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(newValue)
}

// 添加图片
export function addPhoto (el: HTMLTextAreaElement, setValue: Function, value: string) {
    let [start, end] = getCursorPosition(el)
    let newValue = start === end
                    ? `${value.slice(0, start)}\n![图片描述](url)\n${value.slice(end)}`
                    : `${value.slice(0, start)}\n![${value.slice(start, end)}](url)\n${value.slice(end)}`
    
    let selectionStart = start === end ? start + 9 : end + 5
    let selectionEnd = start === end ? end + 12 : end + 8

    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(newValue)
}

// 添加标题
export function addTitle (el: HTMLTextAreaElement, setValue: Function, value: string, symbol: string, txt: string) {
    let [start, end] = getCursorPosition(el)
    let newValue = start === end
                    ? `${value.slice(0, start)}\n${symbol} ${txt}\n${value.slice(end)}`
                    : `${value.slice(0, start)}\n${symbol} ${value.slice(start, end)}\n${value.slice(end)}`
    
    let selectionStart = start + symbol.length + 2
    let selectionEnd = start === end ? end + symbol.length + txt.length + 2 : end + symbol.length + 2
    
    setSelectionRange(el, selectionStart, selectionEnd)
    setValue(newValue)
}

// 添加引用
export function addQuote (el: HTMLTextAreaElement, setValue: Function, value: string) {
    let [start, end] = getCursorPosition(el)
    let newValue = start === end
                    ? `${value.slice(0, start)}\n> 引用内容\n${value.slice(end)}`
                    : `${value.slice(0, start)}\n> ${value.slice(start, end)}\n${value.slice(end)}`
    
    let selectionStart = start + 3
    let selectionEnd = end + 3
    
    setSelectionRange(el, selectionStart, selectionEnd)  
    setValue(newValue)
}
