export let _indentation: number = 4   // 缩进字符个数
export let _initValue: string = ''   // 编辑器初始化字符

export default {
    indentationChange: (value: number) => _indentation = value,
    initValueChange: (value: string) => _initValue = value,
}
