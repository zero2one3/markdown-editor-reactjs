export interface PropsType {
    initValue?: string;  // 初始化时，编辑区的文字
}

export interface historyLinkType {
    value: string;
    pre: null | historyLinkType;
    next: null | historyLinkType;
}
