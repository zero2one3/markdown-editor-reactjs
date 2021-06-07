# 基于React的markdown编辑器组件

若有`bug`或好的建议，欢迎加我微信：`Lpyexplore333`或者在[github](https://github.com/zero2one3/markdown-editor-reactjs)上提pr

## 安装

```shell
# npm
npm i markdown-editor-reactjs --save

# yarn
yarn add markdown-editor-reactjs -D
```

## 例子

```jsx
import MarkdownEdit from 'markdown-editor-reactjs'


function App() {
    
    return (
        <App>
            <MarkdownEdit />
        </App>
    )
}
```


## 快捷键

| windows | mac | 功能 |
| --- | --- | --- |
| tab | tab | 缩进4个字符（支持多行） |
| shift + tab | shift + tab | 删除缩进的4个字符（支持多行） |
| ctrl + z | command + z | 返回上一步 |
| ctrl + y | command + y | 返回下一步 |
| ctrl + b | command + b | 加粗 |
| ctrl + i | command + i | 斜体 |
| ctrl + u | command + u | 删除线 |
| ctrl + l | command + l | 链接 |
| ctrl + o | command + o | 有序列表 |
| ctrl + q | command + q | 引用（暂时有兼容性问题，待处理中） |
| ctrl + 1 | command + 1 | 一级标题 |
| ctrl + 2 | command + 2 | 二级标题 |
| ctrl + 3 | command + 3 | 三级标题 |
| ctrl + 4 | command + 4 | 四级标题 |
| ctrl + 5 | command + 5 | 五级标题 |
| ctrl + 6 | command + 6 | 六级标题 |
| ctrl + alt + t | command + option + t | 表格 |
| ctrl + alt + c | command + option + c | 代码块 |
| ctrl + alt + v | command + option + v | 行内代码 |
| ctrl + alt + l | command + option + l | 图片链接格式 |
| ctrl + alt + u | command + option + u | 无序列表 |

## 代码高亮主题

目前支持的代码高亮主题有：
- github
- railscasts（Default）
- androidstudio
- dracula
- atom-one-dark
- atom-one-light
- monokai-sublime
- tomorrow
- solarized-dark
- solarized-light
- olor-brewer
- zenburn
- agate

## markdown主题

目前支持的markdown主题有：
- github
- maize（Default）

## 其它功能

1. 支持一键**导出**/**导入** `md`格式的文件
2. ...正在努力开发中