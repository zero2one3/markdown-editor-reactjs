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
| ctrl + z | command + z | 返回上一步 |
| tab | tab | 缩进4个字符 |

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