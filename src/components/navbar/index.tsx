import React, { useCallback } from 'react'
import { NavBarContainer } from './style'
import { Tooltip } from 'antd'
import { 
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, OrderedListOutlined,
    UnorderedListOutlined, CarryOutOutlined, LinkOutlined, TableOutlined,
    PictureOutlined, LeftOutlined, RightOutlined
} from '@ant-design/icons'

interface PropsType {

}

export default function NavBar(props: PropsType) {


    return (
        <NavBarContainer>
            <Tooltip title='加粗' arrowPointAtCenter>
                <BoldOutlined className="item"/>
            </Tooltip>
            <Tooltip title='斜体' arrowPointAtCenter>
                <ItalicOutlined className="item"/>
            </Tooltip>
            <Tooltip title='删除线' arrowPointAtCenter>
                <StrikethroughOutlined className="item"/>
            </Tooltip>
            <Tooltip title='有序列表' arrowPointAtCenter>
                <OrderedListOutlined className="item"/>
            </Tooltip>
            <Tooltip title='无序列表' arrowPointAtCenter>
                <UnorderedListOutlined className="item"/>
            </Tooltip>
            <Tooltip title='任务列表' arrowPointAtCenter>
                <CarryOutOutlined className="item"/>
            </Tooltip>
            <Tooltip title='代码块' arrowPointAtCenter>
                <span className="item" style={{ fontSize: 12 }}>
                    <LeftOutlined />/<RightOutlined/>
                </span>
            </Tooltip>
            <Tooltip title='超链接' arrowPointAtCenter>
                <LinkOutlined className="item"/>
            </Tooltip>
            <Tooltip title='表格' arrowPointAtCenter>
                <TableOutlined className="item"/>
            </Tooltip>
            <Tooltip title='图片' arrowPointAtCenter>
                <PictureOutlined className="item"/>
            </Tooltip>
            <section className="right">
                1
            </section>
        </NavBarContainer>
    )
}
