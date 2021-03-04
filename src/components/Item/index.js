import React from "react";
import PropTypes from "prop-types";
import { itemCss } from "./item.styles";

const Item = ({ item, index, removeItem }) => {
    const handleClick = () => {
        removeItem(index);
    };

    return (
        <div css={itemCss}>
            <h3>Name: {item[0]}</h3>
            {item[1]}
            <button onClick={handleClick}>X</button>
        </div>
    );
};

Item.propTypes = {
    item: PropTypes.array,
    index: PropTypes.number,
    removeItem: PropTypes.func,
};

export default Item;
