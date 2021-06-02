// 生成哈希串
export function hash(len: number = 10) {
    let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    let chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let hashString = ''
    for(let i = 0; i < len; i++) {
        if(Math.floor(Math.random()*10) % 2 === 0) {
            hashString += numbers[Math.floor(Math.random()*10)]
        } else {
            let char = chars[Math.floor(Math.random()*26)]
            if(Math.floor(Math.random()*10) % 2 === 0) char = char.toLowerCase();
            hashString += char
        }
    }

    return hashString
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
