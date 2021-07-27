export interface PropsType {
    value: string;         // markdown的文本
    setValue: Function;   // 修改value的值
}

export interface historyLinkType {
    value: string;
    pre: null | historyLinkType;
    next: null | historyLinkType;
    selectionStart: number;
    selectionEnd: number;
}
