import React, { useCallback, useMemo } from 'react'
import { NavBarContainer } from './style'
import { Tooltip, Dropdown, Menu } from 'antd'
import { 
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, OrderedListOutlined,
    UnorderedListOutlined, CarryOutOutlined, LinkOutlined, TableOutlined,
    PictureOutlined, LeftOutlined, RightOutlined
} from '@ant-design/icons'

interface PropsType {
    value: string;
    editChange: (event: any, value?: string) => void;
    editElement: any;
}

export default function NavBar(props: PropsType) {

    // 获取光标所在位置或所选位置
    const getCursorPosition = useCallback(() => {
        let { selectionStart, selectionEnd } = props.editElement.current
        return [selectionStart, selectionEnd]
    }, [])

    // 控制两边加符号的语法，例如：**粗体**、*斜体*、~~删除文本~~ 等等
    const handleTwoSideSymbol = useCallback((value, symbol, txt) => {
        let [start, end] = getCursorPosition()
        let newValue = start === end
                        ? value.slice(0, start) + `${symbol}${txt}${symbol}` + value.slice(end)
                        : value.slice(0, start) + symbol + value.slice(start, end) + symbol + value.slice(end)
        props.editChange('', newValue)
    }, [getCursorPosition])

    // 添加列表语法，例如：- 无序列表、1. 有序列表、- [x] 任务列表 等等
    const addList = useCallback((value, symbol, txt) => {
        let [start, end] = getCursorPosition()
        let newValue = start === end
                        ? `${value.slice(0, start)}\n${symbol} ${txt}\n${value.slice(end)}`
                        : `${value.slice(0, start)}\n${symbol} ${value.slice(start, end)}\n${value.slice(end)}`

        props.editChange('', newValue)
    }, [getCursorPosition])

    // 添加代码块
    const addCodeBlock = (key: string) => {
        let [start, end] = getCursorPosition()
        let newValue = start === end
                        ? `${props.value.slice(0, start)}\n\`\`\`${key}\n\n\`\`\`\n${props.value.slice(end)}`
                        : `${props.value.slice(0, start)}\n\`\`\`${key}\n${props.value.slice(start, end)}\n\`\`\`\n${props.value.slice(end)}`

        props.editChange('', newValue)
    }

    // 代码块的列表元素
    const codeMenu = (
        <Menu onClick={({ key }) => addCodeBlock(key)}>
            <Menu.Item key="js">JavaScript</Menu.Item>
            <Menu.Item key="html">HTML</Menu.Item>
            <Menu.Item key="css">CSS</Menu.Item>
            <Menu.Item key="java">Java</Menu.Item>
        </Menu>
    )

    // 添加链接
    const addLink = () => {
        let [start, end] = getCursorPosition()
        let newValue = start === end
                        ? `${props.value.slice(0, start)}[链接描述文字](https://lpyexplore.gitee.io/blog/)${props.value.slice(end)}`
                        : `${props.value.slice(0, start)}[${props.value.slice(start, end)}](https://lpyexplore.gitee.io/blog/)${props.value.slice(end)}`

        props.editChange('', newValue)
    }

    // 添加表格
    const addTable = () => {
        let [start, end] = getCursorPosition()
        let newValue = start === end
                        ? `${props.value.slice(0, start)}\n| | |\n|--|--|\n| | |${props.value.slice(end)}`
                        : `${props.value.slice(0, start)}\n|${props.value.slice(start, end)}| |\n|--|--|\n| | |${props.value.slice(end)}`

        props.editChange('', newValue)
    }

    // 添加图片
    const addPhoto = () => {
        
    }

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
                overlay={codeMenu} 
                placement="bottomCenter" 
                arrow
                overlayStyle={{ maxHeight: 200, overflow: 'auto' }}
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
            <section className="right">
                1
            </section>
        </NavBarContainer>
    )
}
