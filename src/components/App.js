import React from "react";
import AddItemForm from "./AddItemForm";
import Item from "./Item";
import { Global } from "@emotion/core";
import { globalCss, headerCss } from "./app.styles";

import { handleSignoutClick, handleAuthClick } from "../utils/user";

import useGoogleSheet from "../hooks/useGoogleSheet";

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
];

const App = () => {
    const [
        currentUser,
        sheetData,
        header,
        handleAddItem,
        handleRemoveItem
    ] = useGoogleSheet({
        apiKey: process.env.API_KEY,
        clientId: process.env.CLIENT_ID,
        DISCOVERY_DOCS,
        SCOPES
    });

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
                    {sheetData.map((item, i) => (
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
