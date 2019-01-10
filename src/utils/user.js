/**
 * Returns an object with the current user's name,
 * profile image url and if they're signed in.
 * @param {boolean} isSignedIn
 * @returns {object}
 */
export function getUserInfo(isSignedIn) {
    let user = {
        isSignedIn,
        name: "",
        imageUrl: ""
    }

    if (isSignedIn) {
        const basicProfile = getBasicProfile()
        user.name = basicProfile.getName()
        user.imageUrl = basicProfile.getImageUrl()
    }

    return user
}

/**
 * Gets the current user's profile.
 */
export function getBasicProfile() {
    return window.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
}
