import React, { Component } from "react";

class AddItemForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            date: "",
            store: "",
            shipped: "no",
            arrived: "no",
            notes: "-",
            tracking: "-"
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleInputChange(e) {
        let state = {};
        state[e.target.id] = e.target.value;
        this.setState({ ...state });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.props.addItem({ ...this.state });
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <label>
                    <span>Product Name: </span>
                    <input
                        onChange={this.handleInputChange}
                        type="text"
                        id="name"
                    />
                </label>

                <label>
                    <span>Product Type: </span>
                    <input
                        onChange={this.handleInputChange}
                        type="text"
                        id="type"
                    />
                </label>

                <label>
                    <span>Store:</span>
                    <select onChange={this.handleInputChange} id="store">
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
                    <textarea onChange={this.handleInputChange} id="notes" />
                </label>

                <label>
                    <span>Tracking: </span>
                    <input
                        onChange={this.handleInputChange}
                        type="text"
                        id="tracking"
                    />
                </label>

                <label>
                    <label>Delivery Date: </label>
                    <input
                        onChange={this.handleInputChange}
                        type="date"
                        id="date"
                    />
                </label>

                <button>Click to add an item</button>
            </form>
        );
    }
}

export default AddItemForm;
