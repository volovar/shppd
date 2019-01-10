import React from "react"
import { css } from "emotion"

const itemStyles = css`
    background: #e1e1e1;
    box-sizing: border-box;
    margin-bottom: 1em;
    padding: 0.4em;
    position: relative;
`

const Item = ({ item, index, removeItem }) => {
    const handleClick = () => {
        removeItem(index)
    }

    return (
        <div className={itemStyles}>
            <h3>Name: {item[0]}</h3>
            {item[1]}
            <button onClick={handleClick}>X</button>
        </div>
    )
}

export default Item
