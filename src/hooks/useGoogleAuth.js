import { useEffect, useState } from "react";

const useGoogleAuth = ({ apiKey, clientId, DISCOVERY_DOCS, SCOPES }) => {
    const [currentUser, setCurrentUser] = useState({
        isSignedIn: false
    });

    useEffect(() => {
        window.gapi.load("client:auth2", initClient);
    }, []);

    /**
     * Gets the current user's profile.
     */
    function getBasicProfile() {
        return window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getBasicProfile();
    }

    /**
     * Returns an object with the current user's name,
     * profile image url and if they're signed in.
     * @param {boolean} isSignedIn
     * @returns {object}
     */
    function getUserInfo(isSignedIn) {
        let user = {
            isSignedIn,
            name: "",
            imageUrl: ""
        };

        if (isSignedIn) {
            const basicProfile = getBasicProfile();
            user.name = basicProfile.getName();
            user.imageUrl = basicProfile.getImageUrl();
        }

        return user;
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        window.gapi.client
            .init({
                apiKey: apiKey,
                clientId: clientId,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            })
            .then(
                () => {
                    window.gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(updateSigninStatus);

                    updateSigninStatus(
                        window.gapi.auth2.getAuthInstance().isSignedIn.get()
                    );
                },
                error => {
                    console.log(JSON.stringify(error, null, 2));
                }
            );
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        const user = getUserInfo(isSignedIn);

        setCurrentUser(user);
    }

    return currentUser;
};

export default useGoogleAuth;
