import styled from 'styled-components'

export const MarkdownEditContainer = styled.div`
    height: 100%;
    
    .edit {
        height: 100%;
        width: 50%;
        float: left;
        border: 1px solid #eee;
        background-color: rgb(248, 248, 250);
        padding: 20px;
        resize: none;
        outline: none;
        box-sizing: border-box;
        font-size: 15px;
    }

    .show {
        height: 100%;
        width: 50%;
        padding: 20px;
        overflow: auto;
        box-sizing: border-box;
    }
  
`
