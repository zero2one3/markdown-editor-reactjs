export interface PropsType {
    initValue?: string;  // 初始化时，编辑区的文字
    indentation?: number;  // 缩进字符个数
    bold?: boolean;  // 加粗工具
    italic?: boolean;  // 斜体工具
    deleteLine?: boolean;  // 删除线工具
    disorderList?: boolean;  // 无序列表工具
    orderlyList?: boolean;  // 有序列表工具
    taskList?: boolean;  // 任务列表工具
    link?: boolean;  // 链接工具
    table?: boolean;  // 表格工具
    photo?: boolean;  // 图片工具
    codeBlock?: boolean;  // 代码块工具
}

export interface historyLinkType {
    value: string;
    pre: null | historyLinkType;
    next: null | historyLinkType;
    selectionStart: number;
    selectionEnd: number;
}
