export interface PropsType {
    initValue?: string;  // 初始化时，编辑区的文字
    indentation?: number;  // 缩进字符个数
}

export interface historyLinkType {
    value: string;
    pre: null | historyLinkType;
    next: null | historyLinkType;
    selectionStart: number;
    selectionEnd: number;
}
