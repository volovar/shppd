/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick() {
    window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
    window.gapi.auth2.getAuthInstance().signOut();
}
