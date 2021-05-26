let options: { [key: string]: boolean } = {
    tables: true,  // 表单
    tasklists: true,  // 任务列表  - [x] This task is done ; - [ ] This is still pending
    omitExtraWLInCodeBlocks: false, // 省略代码块中尾行的换行符
    literalMidWordUnderscores: false, // 打开此选项将阻止在单词中间解释下划线为 < em > 和 < strong > ，而是将它们作为字面下划线处理
    strikethrough: true,  //  启用对删除线语法的支持  ~~strikethrough~~
    simpleLineBreaks: true,  //  在行的末尾不需要2个空格
    openLinksInNewWindow: true,  // 所有链接的打开都以新窗口的形式打开
}

interface ConverterType {
    setOption: (key: string, value: boolean) => void
}

function setOptions(converter: ConverterType) {
    Object.keys(options).forEach((key: string) => {
        converter.setOption(key, options[key])
    })
}

export default setOptions