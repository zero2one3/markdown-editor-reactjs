import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { NavBarContainer } from './style'
import { Tooltip, Dropdown, Menu, message } from 'antd'
import { 
    hash, handleTwoSideSymbol, addList, addCodeBlock,
    addLink, addTable, addPhoto
} from '../utils'
import { 
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, OrderedListOutlined,
    UnorderedListOutlined, CarryOutOutlined, LinkOutlined, TableOutlined,
    PictureOutlined, LeftOutlined, RightOutlined, BulbOutlined, CodeOutlined,
    EllipsisOutlined, DownloadOutlined, UploadOutlined, ExpandOutlined,
    CompressOutlined,  
} from '@ant-design/icons'
import {
    _bold, _italic, _deleteLine, _disorderList, _orderlyList,
    _taskList, _link, _table, _photo, _codeBlock, 
} from '../config'

const { Item, ItemGroup } = Menu

interface PropsType {
    value: string;
    setValue: (value: string, selectionStart: number, selectionEnd: number) => void;
    editElement: any;
    fullScreen: boolean;
    setFullScreen: (fullScreen: boolean) => void;
    setLoading: (loading: boolean) => void;
}

const NavBar: React.FC<PropsType> = ({ editElement, setValue, value, setFullScreen, setLoading, fullScreen }) => {
    const [codeHighLightTheme, setCodeHighLightTheme] = useState('railscasts')  // 当前代码高亮的主题
    const [markdownTheme, setMarkdownTheme] = useState('maize')  // 当前markdown的主题

    // 代码块的列表元素
    const codeBlockMenu = (
        <Menu onClick={({ key }) => addCodeBlock(editElement.current, setValue, value, key)}>
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

    // 选择代码高亮主题
    const selectCodeHighLightTheme = useCallback(({ key }) => {  
        setLoading(true)   
        setCodeHighLightTheme(key)
    }, [])
    
    // 代码高亮选择菜单
    const codeHighLightMenu = useMemo(() => (
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
    ), [selectCodeHighLightTheme])

    // 选择markdown主题
    const selectMarkdownTheme = ({ key } : { key: string }) => {
        setLoading(true)
        setMarkdownTheme(key)
    }

    // markdown主题选择菜单
    const markdownThemeMenu = useMemo(() => (
        <Menu onClick={selectMarkdownTheme}>
            <ItemGroup title="markdown主题" className="item-group-list-container markdown-theme-menu">
                <Item key="github" className={`${markdownTheme === 'github' && 'active'}`}>github</Item>
                <Item key="maize" className={`${markdownTheme === 'maize' && 'active'}`}>maize</Item>
            </ItemGroup>
        </Menu>
    ), [selectMarkdownTheme])

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
        if(!value) return message.warning('当前内容为空，无需导出');
        let blob = new Blob([value])
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
                setValue(reader.result as string, 0, 0)
                message.success('导入成功')
            }
        })
    }

    // 更多菜单
    const moreMenu = useMemo(() => (
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
    ), [handleMoreFunction])
    
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
        newLink.onload = () => setLoading(false);
        newLink.onerror = () => {
            setLoading(false);
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
        newLink.onload = () => setLoading(false);
        newLink.onerror = () => {
            setLoading(false);
            message.error('主题获取失败，请稍后重试或尝试其它主题')
        }
        head.appendChild(newLink)
    }, [markdownTheme])

    return (
        <NavBarContainer>
        {
            _bold && 
            <Tooltip title='加粗' arrowPointAtCenter>
                <BoldOutlined className="item" onClick={() => handleTwoSideSymbol(editElement.current, setValue, value, '**', '加粗字体')}/>
            </Tooltip>
        }
        {   _italic &&
            <Tooltip title='斜体' arrowPointAtCenter>
                <ItalicOutlined className="item" onClick={() => handleTwoSideSymbol(editElement.current, setValue, value, '*', '倾斜字体')}/>
            </Tooltip>
        }
        {
            _deleteLine &&
            <Tooltip title='删除线' arrowPointAtCenter>
                <StrikethroughOutlined className="item" onClick={() => handleTwoSideSymbol(editElement.current, setValue, value, '~~', '删除文本')}/>
            </Tooltip>
        }
        {
            _disorderList &&
            <Tooltip title='有序列表' arrowPointAtCenter>
                <OrderedListOutlined className="item" onClick={() => addList(editElement.current, setValue, value, '1.', '有序列表')}/>
            </Tooltip>
        }
        {
            _orderlyList &&
            <Tooltip title='无序列表' arrowPointAtCenter>
                <UnorderedListOutlined className="item" onClick={() => addList(editElement.current, setValue, value, '-', '无序列表')}/>
            </Tooltip>
        }
        {
            _taskList &&
            <Tooltip title='任务列表' arrowPointAtCenter>
                <CarryOutOutlined className="item" onClick={() => addList(editElement.current, setValue, value, '- [x]', '任务列表')}/>
            </Tooltip>
        }
        {
            _codeBlock &&
            <Dropdown 
                overlay={codeBlockMenu} 
                placement="bottomCenter" 
                arrow
            >
                <span className="item code" style={{ fontSize: 12 }}>
                    <LeftOutlined />/<RightOutlined/>
                </span>
            </Dropdown>
        }
        {
            _link &&
            <Tooltip title='超链接' arrowPointAtCenter>
                <LinkOutlined className="item" onClick={() => addLink(editElement.current, setValue, value)}/>
            </Tooltip>
        }
        {
            _table &&
            <Tooltip title='表格' arrowPointAtCenter>
                <TableOutlined className="item" onClick={() => addTable(editElement.current, setValue, value)}/>
            </Tooltip>
        } 
        {
            _photo &&
            <Tooltip title='图片' arrowPointAtCenter>
                <PictureOutlined className="item" onClick={() => addPhoto(editElement.current, setValue, value)}/>
            </Tooltip> 
        }
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
                    fullScreen
                    ? <Tooltip title='退出全屏' arrowPointAtCenter>
                        <CompressOutlined className="item" onClick={() => {setFullScreen(false);message.info('退出全屏模式')}}/>
                      </Tooltip>
                    : <Tooltip title='进入全屏' arrowPointAtCenter>
                        <ExpandOutlined className="item" onClick={() => {setFullScreen(true);message.info('进入全屏模式')}}/>
                      </Tooltip>
                }
            </section>
        </NavBarContainer>
    )
}

export default NavBar
