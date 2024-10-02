export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_ClientId,
        authority: `https://login.microsoftonline.com/common`,
        redirectUri: import.meta.env.VITE_MSAL_RedirectURL,
    },
}

export const loginRequest = {
    scopes: ['User.Read'],
}
