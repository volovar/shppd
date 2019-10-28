import { useEffect, useState } from "react";
import useGoogleAuth from "./useGoogleAuth";

const SPREADSHEET_ID = getSpreadSheetId();

const useGoogleSheet = ({ apiKey, clientId, DISCOVERY_DOCS, SCOPES }) => {
    const currentUser = useGoogleAuth({
        apiKey,
        clientId,
        DISCOVERY_DOCS,
        SCOPES
    });

    const [sheetData, setSheetData] = useState([]);
    const [header, setHeader] = useState([]);

    useEffect(() => {
        updateSheetData(currentUser.isSignedIn);
    }, [currentUser]);

    function updateSheetData(isSignedIn) {
        if (isSignedIn) {
            window.gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: "Sheet1"
                })
                .then(
                    response => {
                        console.log(response.result.values);
                        setupHeaders(response);
                        setSheetData(response.result.values.slice(1));
                        setHeader(response.result.values[0]);
                    },
                    err => {
                        console.log(err);
                        // TODO: Create a new sheet if one doesn't exist
                        // createSpreadsheet()
                    }
                );
        } else {
            setSheetData([]);
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
                    setSheetData([...sheetData, ...response.result.values]);
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

    return [currentUser, sheetData, header, handleAddItem, handleRemoveItem];
};

function getSpreadSheetId() {
    return (
        window.localStorage.getItem("spreadsheet_id") ||
        process.env.SPREADSHEET_ID
    );
}

/**
 * Adds a new item to the spreadsheet.
 * @param {object} item - an object containing the data to be saved
 * @returns {array}
 */
function addItem({
    name,
    type,
    store,
    shipped,
    arrived,
    notes = "-",
    tracking = "-",
    date
}) {
    return new Promise(resolve => {
        window.gapi.client.sheets.spreadsheets.values
            .append({
                spreadsheetId: SPREADSHEET_ID,
                range: "Sheet1!A1:H1",
                valueInputOption: "USER_ENTERED",
                majorDimension: "ROWS",
                values: [
                    [name, type, store, shipped, arrived, notes, tracking, date]
                ]
            })
            .then(response => {
                resolve(response.result);
            });
    });
}

/**
 * Creates a new spreadsheet.
 */
/* TODO: implement this */
function createSpreadsheet() {
    window.gapi.client.sheets.spreadsheets
        .create({
            properties: {
                title: "Shppd"
            }
        })
        .then(response => console.log(response));
}

/**
 * Remove the cells at the given index
 * @param {number} index
 */
function removeItem(index) {
    const cell = index + 2;
    const range = `Sheet1!A${cell}:H${cell}`;

    return new Promise(resolve => {
        window.gapi.client.sheets.spreadsheets.values
            .clear({
                spreadsheetId: SPREADSHEET_ID,
                range
            })
            .then(response => {
                resolve(response.result);
            });
    });
}

/**
 * Formats the header row of a new sheet and fills in the
 * values for the header cells.
 */
function setupHeaders(response) {
    if (
        response.result.values ||
        (response.result.values && response.result.values[0][0] === "Name")
    ) {
        return;
    }
    console.log("setting up headers");

    formatHeaders(0);
    fillInHeaderValues(0);

    /**
     * Freeze header row and set formatting.
     */
    function formatHeaders(SHEET_ID) {
        window.gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requests: [
                {
                    repeatCell: {
                        range: {
                            sheetId: SHEET_ID,
                            startRowIndex: 0,
                            endRowIndex: 1
                        },
                        cell: {
                            userEnteredFormat: {
                                textFormat: {
                                    bold: true
                                }
                            }
                        },
                        fields: "userEnteredFormat.textFormat"
                    }
                },
                {
                    updateSheetProperties: {
                        properties: {
                            sheetId: SHEET_ID,
                            gridProperties: {
                                frozenRowCount: 1
                            }
                        },
                        fields: "gridProperties.frozenRowCount"
                    }
                }
            ]
        });
        // .then(response => {
        //     console.log("formatted and froze header cells")
        //     console.log(response)
        // })
    }

    /**
     * Update the header cell values.
     */
    function fillInHeaderValues() {
        window.gapi.client.sheets.spreadsheets.values
            .update({
                spreadsheetId: SPREADSHEET_ID,
                range: "Sheet1!A1:H1",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [
                        [
                            "Name",
                            "Type",
                            "Store",
                            "Shipped",
                            "Arrived",
                            "Notes",
                            "Tracking",
                            "Delivery Date"
                        ]
                    ]
                }
            })
            .then(response => {
                console.log("created header cells");
                console.log(response.result);
            });
    }
}

export default useGoogleSheet;
