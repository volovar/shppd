import React, { useEffect, useState } from "react";
import AddItemForm from "./AddItemForm";
import Item from "./Item";
import { Global } from "@emotion/core";
import { globalCss, headerCss } from "./app.styles";

import {
    getSpreadSheetId,
    handleSignoutClick,
    handleAuthClick,
    addItem,
    removeItem,
    setupHeaders
} from "../utils/spreadsheets";
import { getUserInfo } from "../utils/user";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const SPREADSHEET_ID = getSpreadSheetId();

const App = () => {
    const [currentUser, setCurrentUser] = useState({ isSignedIn: false });
    const [header, setHeader] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        window.gapi.load("client:auth2", initClient);
    }, []);

    function setOrderData(isSignedIn) {
        if (isSignedIn) {
            window.gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: "Sheet1"
                })
                .then(
                    response => {
                        setupHeaders(response);
                        setData(response.result.values.slice(1));
                        setHeader(response.result.values[0]);
                    },
                    err => {
                        console.log(err);
                        // TODO: Create a new sheet if one doesn't exist
                        // createSpreadsheet()
                    }
                );
        } else {
            setData([]);
            setHeader([]);
        }
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        const currentUser = getUserInfo(isSignedIn);

        setCurrentUser(currentUser);
        setOrderData(isSignedIn);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        window.gapi.client
            .init({
                apiKey: process.env.API_KEY,
                clientId: process.env.CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            })
            .then(
                () => {
                    window.gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(updateSigninStatus);

                    this.updateSigninStatus(
                        window.gapi.auth2.getAuthInstance().isSignedIn.get()
                    );
                },
                error => {
                    console.log(JSON.stringify(error, null, 2));
                }
            );
    }

    const handleAddItem = newItem => {
        addItem(newItem).then(newData => {
            window.gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: newData.updates.updatedRange
                })
                .then(response => {
                    console.log(response);
                    setData([...data, ...response.result.values]);
                });
        });
    };

    // async handleAddItem(newItem) {
    //     const newData = await addItem(newItem)
    //     console.log(newData.updates.updatedRange)
    //     gapi.client.sheets.spreadsheets.values
    //         .get({
    //             spreadsheetId: SPREADSHEET_ID,
    //             range: newData.updates.updatedRange
    //         })
    //         .then(response => {
    //             console.log(response)
    //             this.setState({
    //                 data: [...this.state.data, ...response.result.values]
    //             })
    //         })
    // }

    const handleRemoveItem = index => {
        removeItem(index).then(result => {
            console.log("item removed");
            console.log(result);
        });
    };

    return (
        <>
            <Global styles={globalCss} />
            <div>
                <header css={headerCss}>
                    <h2>Shppd</h2>
                    {currentUser.isSignedIn ? (
                        <>
                            Hello {currentUser.name}!
                            <button onClick={handleSignoutClick}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button onClick={handleAuthClick}>Sign In</button>
                    )}
                </header>
                <div>
                    {data.map((item, i) => (
                        <Item
                            key={item[0]}
                            item={item}
                            index={i}
                            removeItem={handleRemoveItem}
                        />
                    ))}
                </div>
                <AddItemForm addItem={handleAddItem} />
            </div>
        </>
    );
};

export default App;
