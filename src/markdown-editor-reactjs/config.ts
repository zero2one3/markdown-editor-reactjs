export let _indentation: number = 4   // 缩进字符个数
export let _initValue: string = ''   // 编辑器初始化字符
export let _bold: boolean = true  // 是否启用加粗工具
export let _italic: boolean = true  // 是否启用斜体工具
export let _deleteLine: boolean = true  // 是否启用删除线工具
export let _disorderList: boolean = true  // 是否启用无序列表工具
export let _orderlyList: boolean = true  // 是否启用有序列表工具
export let _taskList: boolean = true  // 是否启用任务列表工具
export let _link: boolean = true  // 是否启用链接工具
export let _table: boolean = true  // 是否启用表格工具
export let _photo: boolean = true  // 是否启用图片工具
export let _codeBlock: boolean = true  // 是否启用代码块工具

export default {
    indentationChange: (value: number) => _indentation = value,
    initValueChange: (value: string) => _initValue = value,
    boldChange: (value: boolean) => _bold = value,
    italicChange: (value: boolean) => _italic = value,
    deleteLineChange: (value: boolean) => _deleteLine = value,
    disorderListChange: (value: boolean) => _disorderList = value,
    orderlyListChange: (value: boolean) => _orderlyList = value,
    taskListChange: (value: boolean) => _taskList = value,
    linkChange: (value: boolean) => _link = value,
    tableChange: (value: boolean) => _table = value,
    photoChange: (value: boolean) => _photo = value,
    codeBlockChange: (value: boolean) => _codeBlock = value,
}
