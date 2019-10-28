import { useEffect } from "react";
import useGoogleAuth from "./useGoogleAuth";

const useGoogleSheet = ({ apiKey, clientId, DISCOVERY_DOCS, SCOPES }) => {
    const user = useGoogleAuth({ apiKey, clientId, DISCOVERY_DOCS, SCOPES });

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
};

export default useGoogleSheet;
