import React, { Component } from "react"
import AddItemForm from "./AddItemForm"
import Item from "./Item"
import {
    getSpreadSheetId,
    handleSignoutClick,
    handleAuthClick,
    createSpreadsheet,
    addItem,
    removeItem,
    setupHeaders
} from "../utils/spreadsheets"
import { getUserInfo } from "../utils/user"

const SCOPES = "https://www.googleapis.com/auth/spreadsheets"
const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
]
const SPREADSHEET_ID = getSpreadSheetId()

class App extends Component {
    state = {
        currentUser: {
            isSignedIn: false
        },
        header: [],
        data: []
    }

    componentDidMount() {
        window.gapi.load("client:auth2", this.initClient)
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    initClient = () => {
        window.gapi.client
            .init({
                apiKey: process.env.API_KEY,
                clientId: process.env.CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            })
            .then(
                () => {
                    gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(this.updateSigninStatus)

                    this.updateSigninStatus(
                        gapi.auth2.getAuthInstance().isSignedIn.get()
                    )
                },
                error => {
                    console.log(JSON.stringify(error, null, 2))
                }
            )
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus = isSignedIn => {
        const currentUser = getUserInfo(isSignedIn)

        this.setState({ currentUser })
        this.setOrderData(isSignedIn)
    }

    setOrderData = isSignedIn => {
        if (isSignedIn) {
            gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: "Sheet1"
                })
                .then(
                    response => {
                        setupHeaders(response)

                        this.setState({
                            header: response.result.values[0],
                            data: response.result.values.slice(1)
                        })
                    },
                    err => {
                        console.log(err)
                        // TODO: Create a new sheet if one doesn't exist
                        // createSpreadsheet()
                    }
                )
        } else {
            this.setState({
                header: [],
                data: []
            })
        }
    }

    handleAddItem = newItem => {
        addItem(newItem).then(newData => {
            gapi.client.sheets.spreadsheets.values
                .get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: newData.updates.updatedRange
                })
                .then(response => {
                    console.log(response)
                    this.setState({
                        data: [...this.state.data, ...response.result.values]
                    })
                })
        })
    }

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

    handleRemoveItem = index => {
        removeItem(index).then(result => {
            console.log("item removed")
            console.log(result)
        })
    }

    render() {
        const { data, currentUser } = this.state
        return (
            <div>
                <header>
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
                            removeItem={this.handleRemoveItem}
                        />
                    ))}
                </div>
                <AddItemForm addItem={this.handleAddItem} />
            </div>
        )
    }
}

export default App
