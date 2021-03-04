import React, { useState } from "react";
import PropTypes from "prop-types";
import { formCss } from "./add-item-form.styles";

const AddItemForm = () => {
    const [state, setState] = useState({
        name: "",
        date: "",
        store: "",
        shipped: "no",
        arrived: "no",
        notes: "-",
        tracking: "-",
    });

    const handleInputChange = (e) => {
        let newState = { ...state };
        newState[e.target.id] = e.target.value;
        setState({ ...newState });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { addItem } = this.props;

        addItem({ ...state });
    };

    return (
        <form css={formCss} onSubmit={handleFormSubmit}>
            <label>
                <span>Product Name: </span>
                <input onChange={handleInputChange} type="text" id="name" />
            </label>

            <label>
                <span>Product Type: </span>
                <input onChange={handleInputChange} type="text" id="type" />
            </label>

            <label>
                <span>Store:</span>
                <select onChange={handleInputChange} id="store">
                    <option value="" />
                    <option value="amazon">Amazon</option>
                    <option value="bestbuy">Best Buy</option>
                </select>
            </label>

            <span>Shipped: </span>
            <label>
                <input type="radio" id="no" value="no" name="shipped" />
                <span>No</span>
            </label>
            <label>
                <input type="radio" id="yes" value="yes" name="shipped" />
                <span>Yes</span>
            </label>

            <span>Arrived: </span>
            <label>
                <input type="radio" id="no" value="no" name="arrived" />
                <span>No</span>
            </label>
            <label>
                <input type="radio" id="yes" value="yes" name="arrived" />
                <span>Yes</span>
            </label>

            <label>
                <span>Notes: </span>
                <textarea onChange={handleInputChange} id="notes" />
            </label>

            <label>
                <span>Tracking: </span>
                <input onChange={handleInputChange} type="text" id="tracking" />
            </label>

            <label>
                <label>Delivery Date: </label>
                <input onChange={handleInputChange} type="date" id="date" />
            </label>

            <button>Click to add an item</button>
        </form>
    );
};

AddItemForm.propTypes = {
    addItem: PropTypes.func,
};

export default AddItemForm;
