import styled from 'styled-components'

export const NavBarContainer = styled.nav`
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .item {
        cursor: pointer;
        margin-right: 15px;
        padding: 5px;
        font-size: 17px;

        &:hover {
            background-color: #eee;
        }

        &.code {
            padding: 5px 0;
        }
    }

    .right {
        flex: 1;
        text-align: right;
    }
`
