export interface PropsType {
    value: string;         // markdown的文本
    setValue: Function;   // 修改value的值
    mode?: ModeType;  //  编辑器模式
    showTOC?: boolean;   // 是否展示目录
}

export interface StateType {
    loading: boolean;    // 当前页面是否加载
    mode: ModeType;      // 编辑器的模式
    htmlString: string;  // 展示区的dom字符串
    showTOC: boolean;    // 是否展示目录
}

// 编辑器模式
export enum ModeType {  
    NORMAL = 'normal',   // 默认模式：有工具栏、编辑区、预览区
    EDIT = 'edit',      // 仅编辑：有工具栏、编辑区
    PREVIEW = 'preview',   // 仅预览：有工具栏、预览区
    EXHIBITION = 'exhibition',   // 纯展示模式：只有预览区
}

// 用户操作的历史记录
export interface HistoryLinkType {
    value: string;                  // 编辑区的字符串
    pre: null | HistoryLinkType;    // 上一步操作
    next: null | HistoryLinkType;   // 下一步操作
    selectionStart: number;         // 光标的起始位置
    selectionEnd: number;           // 光标的结束位置
}

// 代码块语言
export interface CodeBlockType {
    key: string;
    language: string;
}
