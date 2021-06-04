import React, { useCallback, useState, useEffect } from 'react'
import { NavBarContainer } from './style'
import { Tooltip, Dropdown, Menu, message } from 'antd'
import { hash, getCursorPosition, setSelectionRange } from '../utils'
import { 
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, OrderedListOutlined,
    UnorderedListOutlined, CarryOutOutlined, LinkOutlined, TableOutlined,
    PictureOutlined, LeftOutlined, RightOutlined, BulbOutlined, CodeOutlined,
    EllipsisOutlined, DownloadOutlined, UploadOutlined, ExpandOutlined,
    CompressOutlined,  
} from '@ant-design/icons'

const { Item, ItemGroup } = Menu

interface PropsType {
    value: string;
    setValue: (value: string, selectionStart: number, selectionEnd: number) => void;
    editElement: any;
    fullScreen: boolean;
    setFullScreen: (fullScreen: boolean) => void;
    setLoading: (loading: boolean) => void;
}

export default function NavBar(props: PropsType) {
    const [codeHighLightTheme, setCodeHighLightTheme] = useState('railscasts')  // 当前代码高亮的主题
    const [markdownTheme, setMarkdownTheme] = useState('maize')  // 当前markdown的主题

    // 控制两边加符号的语法，例如：**粗体**、*斜体*、~~删除文本~~ 等等
    const handleTwoSideSymbol = useCallback((value, symbol, txt) => {
        let el = props.editElement.current
        let [start, end] = getCursorPosition(el)

        let newValue = start === end
                        ? value.slice(0, start) + `${symbol}${txt}${symbol}` + value.slice(end)
                        : value.slice(0, start) + symbol + value.slice(start, end) + symbol + value.slice(end)
        
        let selectionStart = start + symbol.length
        let selectionEnd = start === end ? end + symbol.length + txt.length : end + symbol.length

        props.setValue(newValue, selectionStart, selectionEnd)
        setSelectionRange(el, selectionStart, selectionEnd)  // 选中加粗的文本
    }, [])

    // 添加列表语法，例如：- 无序列表、1. 有序列表、- [x] 任务列表 等等
    const addList = useCallback((value, symbol, txt) => {
        let el = props.editElement.current
        let [start, end] = getCursorPosition(el)

        let newValue = start === end
                        ? `${value.slice(0, start)}\n${symbol} ${txt}\n${value.slice(end)}`
                        : `${value.slice(0, start)}\n${symbol} ${value.slice(start, end)}\n${value.slice(end)}`

        let selectionStart = start + 2 + symbol.length
        let selectionEnd = start === end ? end + 2 + symbol.length + txt.length : end + 2 + symbol.length

        props.setValue(newValue, selectionStart, selectionEnd)
        setSelectionRange(el, selectionStart, selectionEnd)
    }, [])

    // 添加代码块
    const addCodeBlock = ({ key }: { key: string }) => {
        let el = props.editElement.current
        let [start, end] = getCursorPosition(el)

        let newValue = start === end
                        ? `${props.value.slice(0, start)}\n\`\`\`${key}\n\n\`\`\`\n${props.value.slice(end)}`
                        : `${props.value.slice(0, start)}\n\`\`\`${key}\n${props.value.slice(start, end)}\n\`\`\`\n${props.value.slice(end)}`
        
        let selectionStart = end + 5 + key.length
        let selectionEnd = end + 5 + key.length

        props.setValue(newValue, selectionStart, selectionEnd)
        setSelectionRange(el, selectionStart, selectionEnd)
    }

    // 代码块的列表元素
    const codeBlockMenu = (
        <Menu onClick={addCodeBlock}>
            <ItemGroup title="代码块语言" className="item-group-list-container">
                <Item key="js">JavaScript</Item>
                <Item key="ts">TypeScript</Item>
                <Item key="html">HTML</Item>
                <Item key="css">CSS</Item>
                <Item key="java">Java</Item>
                <Item key="bash">Bash</Item>
                <Item key="c">C</Item>
                <Item key="csharp">C#</Item>
                <Item key="c++">C++</Item>
                <Item key="go">Go</Item>
                <Item key="json">JSON</Item>
                <Item key="php">PHP</Item>
                <Item key="python">Python</Item>
                <Item key="ruby">Ruby</Item>
                <Item key="rust">Rust</Item>
                <Item key="sql">SQL</Item>
                <Item key="shell">Shell Session</Item>
                <Item key="vb">Visual Basic</Item>
            </ItemGroup>
        </Menu>
    )

    // 添加链接
    const addLink = () => {
        let { value, editElement: { current: el } } = props
        let [start, end] = getCursorPosition(el)
        let newValue = start === end
                        ? `${value.slice(0, start)}[链接描述文字](url)${value.slice(end)}`
                        : `${value.slice(0, start)}[${value.slice(start, end)}](url)${value.slice(end)}`

        let selectionStart = start === end ? start + 9 : end + 3
        let selectionEnd = start === end ? end + 12 : end + 6

        props.setValue(newValue, selectionStart, selectionEnd)
        setSelectionRange(el, selectionStart, selectionEnd)
    }

    // 添加表格
    const addTable = () => {
        let { value, editElement: { current: el } } = props
        let [start, end] = getCursorPosition(el)
        let newValue = start === end
                        ? `${value.slice(0, start)}\n|  |  |\n|---|---|\n|  |  |${value.slice(end)}`
                        : `${value.slice(0, start)}\n| ${value.slice(start, end)} |  |\n|---|---|\n|  |  |${value.slice(end)}`

        let selectionStart = start + 3
        let selectionEnd = end + 3

        props.setValue(newValue, selectionStart, selectionEnd)
        setSelectionRange(el, selectionStart, selectionEnd)
    }

    // 添加图片
    const addPhoto = () => {
        let [start, end] = getCursorPosition(props.editElement.current)
        let newValue = start === end
                        ? `${props.value.slice(0, start)}\n![图片描述](url)\n${props.value.slice(end)}`
                        : `${props.value.slice(0, start)}![${props.value.slice(start, end)}](url)${props.value.slice(end)}`
        // props.setValue(newValue)
    }

    // 选择代码高亮主题
    const selectCodeHighLightTheme = useCallback(({ key }) => {  
        props.setLoading(true)   
        setCodeHighLightTheme(key)
    }, [])
    
    // 代码高亮选择菜单
    const codeHighLightMenu = (
        <Menu onClick={selectCodeHighLightTheme}>
            <ItemGroup title="代码高亮主题" className="item-group-list-container code-highlight-theme-menu">
                <Item key="github" className={`${codeHighLightTheme === 'github' && 'active'}`}>github</Item>
                <Item key="railscasts" className={`${codeHighLightTheme === 'railscasts' && 'active'}`}>railscasts</Item>
                <Item key="androidstudio" className={`${codeHighLightTheme === 'androidstudio' && 'active'}`}>androidstudio</Item>
                <Item key="dracula" className={`${codeHighLightTheme === 'dracula' && 'active'}`}>dracula</Item>
                <Item key="atom-one-dark" className={`${codeHighLightTheme === 'atom-one-dark' && 'active'}`}>atom-one-dark</Item>
                <Item key="atom-one-light" className={`${codeHighLightTheme === 'atom-one-light' && 'active'}`}>atom-one-light</Item>
                <Item key="monokai-sublime" className={`${codeHighLightTheme === 'monokai-sublime' && 'active'}`}>monokai-sublime</Item>
                <Item key="tomorrow" className={`${codeHighLightTheme === 'tomorrow' && 'active'}`}>tomorrow</Item>
                <Item key="solarized-dark" className={`${codeHighLightTheme === 'solarized-dark' && 'active'}`}>solarized-dark</Item>
                <Item key="solarized-light" className={`${codeHighLightTheme === 'solarized-light' && 'active'}`}>solarized-light</Item>
                <Item key="color-brewer" className={`${codeHighLightTheme === 'color-brewer' && 'active'}`}>color-brewer</Item>
                <Item key="zenburn" className={`${codeHighLightTheme === 'zenburn' && 'active'}`}>zenburn</Item>
                <Item key="agate" className={`${codeHighLightTheme === 'agate' && 'active'}`}>agate</Item>
            </ItemGroup>
        </Menu>
    )

    // 选择markdown主题
    const selectMarkdownTheme = ({ key } : { key: string }) => {
        props.setLoading(true)
        setMarkdownTheme(key)
    }

    // markdown主题选择菜单
    const markdownThemeMenu = (
        <Menu onClick={selectMarkdownTheme}>
            <ItemGroup title="markdown主题" className="item-group-list-container markdown-theme-menu">
                <Item key="github" className={`${markdownTheme === 'github' && 'active'}`}>github</Item>
                <Item key="maize" className={`${markdownTheme === 'maize' && 'active'}`}>maize</Item>
            </ItemGroup>
        </Menu>
    )

    // 控制「更多」中的按钮的点击
    const handleMoreFunction = useCallback(({ key }) => {
        switch(key) {
            case 'importMd':
                importMd();
                break;
            case 'exportMd':
                exportMd();
                break;
        }
    }, [])

    // 导出md文件
    const exportMd = () => {
        if(!Blob || !URL) return message.error('浏览器不支持导出md文件，请更换浏览器再试');
        if(!props.value) return message.warning('当前内容为空，无需导出');
        let blob = new Blob([props.value])
        let a = document.createElement('a')
        let downloadURL = URL.createObjectURL(blob)
        a.href = downloadURL
        a.download = `${hash()}.md`
        a.click()
        URL.revokeObjectURL(downloadURL);
    }

    // 导入md文件
    const importMd = () => {
        if(!FileReader) return message.error('浏览器不支持导入md文件，请更换浏览器再试')
        let input = document.createElement('input')
        input.type = 'file'
        input.accept = '.md'
        input.click()
        input.addEventListener('change', () => {
            let files = input.files as FileList
            if(!files.length) return;

            let reader = new FileReader()
            reader.readAsText(files[0])
            reader.onload = () => {
                props.setValue(reader.result as string, 0, 0)
                message.success('导入成功')
            }
        })
    }

    // 更多菜单
    const moreMenu = (
        <Menu onClick={handleMoreFunction}>
            <Item key="importMd">
                <UploadOutlined />
                导入md
            </Item>
            <Item key="exportMd">
                <DownloadOutlined />
                导出md
            </Item>
        </Menu>
    )
    
    // 切换代码高亮主题
    useEffect(() => {
        let head = document.head 
        let oldLink = head.getElementsByClassName('highlightjs-style-link')

        if(oldLink.length) head.removeChild(oldLink[0])
        
        let newLink = document.createElement('link')
        newLink.setAttribute('rel', 'stylesheet')
        newLink.setAttribute('type', 'text/css')
        newLink.setAttribute('class', 'highlightjs-style-link')
        newLink.setAttribute('href', `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/${codeHighLightTheme}.min.css`)
        newLink.onload = () => props.setLoading(false);
        newLink.onerror = () => {
            props.setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
        
    }, [codeHighLightTheme])

    // 切换markdown样式主题
    useEffect(() => {
        let head = document.head
        let oldLink = head.getElementsByClassName('markdownTheme-style-link')

        if(oldLink.length) head.removeChild(oldLink[0])

        let newLink = document.createElement('link')
        newLink.setAttribute('rel', 'stylesheet')
        newLink.setAttribute('type', 'text/css')
        newLink.setAttribute('class', 'markdownTheme-style-link')
        newLink.setAttribute('href', `http://lpyexplore.gitee.io/taobao_staticweb/css/theme/${markdownTheme}.css`)
        newLink.onload = () => props.setLoading(false);
        newLink.onerror = () => {
            props.setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
    }, [markdownTheme])

    return (
        <NavBarContainer>
            <Tooltip title='加粗' arrowPointAtCenter>
                <BoldOutlined className="item" onClick={() => handleTwoSideSymbol(props.value, '**', '加粗字体')}/>
            </Tooltip>
            <Tooltip title='斜体' arrowPointAtCenter>
                <ItalicOutlined className="item" onClick={() => handleTwoSideSymbol(props.value, '*', '倾斜字体')}/>
            </Tooltip>
            <Tooltip title='删除线' arrowPointAtCenter>
                <StrikethroughOutlined className="item" onClick={() => handleTwoSideSymbol(props.value, '~~', '删除文本')}/>
            </Tooltip>
            <Tooltip title='有序列表' arrowPointAtCenter>
                <OrderedListOutlined className="item" onClick={() => addList(props.value, '1.', '有序列表')}/>
            </Tooltip>
            <Tooltip title='无序列表' arrowPointAtCenter>
                <UnorderedListOutlined className="item" onClick={() => addList(props.value, '-', '无序列表')}/>
            </Tooltip>
            <Tooltip title='任务列表' arrowPointAtCenter>
                <CarryOutOutlined className="item" onClick={() => addList(props.value, '- [x]', '任务列表')}/>
            </Tooltip>
            <Dropdown 
                overlay={codeBlockMenu} 
                placement="bottomCenter" 
                arrow
            >
                <span className="item code" style={{ fontSize: 12 }}>
                    <LeftOutlined />/<RightOutlined/>
                </span>
            </Dropdown>
            <Tooltip title='超链接' arrowPointAtCenter>
                <LinkOutlined className="item" onClick={addLink}/>
            </Tooltip>
            <Tooltip title='表格' arrowPointAtCenter>
                <TableOutlined className="item" onClick={addTable}/>
            </Tooltip>
            <Tooltip title='图片' arrowPointAtCenter>
                <PictureOutlined className="item" onClick={addPhoto}/>
            </Tooltip> 
            <Dropdown 
                overlay={markdownThemeMenu} 
                placement="bottomCenter" 
                arrow
            >
                <BulbOutlined className="item"/>
            </Dropdown>
            <Dropdown 
                overlay={codeHighLightMenu} 
                placement="bottomCenter" 
                arrow
            >
                <CodeOutlined className="item"/>
            </Dropdown>
            <Dropdown 
                overlay={moreMenu} 
                placement="bottomCenter" 
                arrow
            >
                <EllipsisOutlined className="item"/>
            </Dropdown>
            <section className="right">
                {
                    props.fullScreen
                    ? <Tooltip title='退出全屏' arrowPointAtCenter>
                        <CompressOutlined className="item" onClick={() => {props.setFullScreen(false);message.info('退出全屏模式')}}/>
                      </Tooltip>
                    : <Tooltip title='进入全屏' arrowPointAtCenter>
                        <ExpandOutlined className="item" onClick={() => {props.setFullScreen(true);message.info('进入全屏模式')}}/>
                      </Tooltip>
                }
            </section>
        </NavBarContainer>
    )
}
