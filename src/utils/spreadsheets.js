const SHEET_ID = 0;

/**
 * Creates a new spreadsheet.
 */
export function createSpreadsheet() {
    window.gapi.client.sheets.spreadsheets
        .create({
            properties: {
                title: "Shppd"
            }
        })
        .then(response => console.log(response));
}

export function getSpreadSheetId() {
    return (
        window.localStorage.getItem("spreadsheet_id") ||
        process.env.SPREADSHEET_ID
    );
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick(event) {
    window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick(event) {
    window.gapi.auth2.getAuthInstance().signOut();
}

/**
 * Adds a new item to the spreadsheet.
 * @param {object} item - an object containing the data to be saved
 * @returns {array}
 */
export function addItem({
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
 * Remove the cells at the given index
 * @param {number} index
 */
export function removeItem(index) {
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
export function setupHeaders(response) {
    if (
        response.result.values ||
        (response.result.values && response.result.values[0][0] === "Name")
    ) {
        return;
    }
    console.log("setting up headers");

    formatHeaders();
    fillInHeaderValues();
}

/**
 * Freeze header row and set formatting.
 */
function formatHeaders() {
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
