import { PERSONAL_FINANCE_ACCESS_TOKEN } from '../constants/appConstants';

/**
 * Provides an abstracted interface for the AUth localstorage.
 */
export const AuthLSService = Object.freeze({
    /**
     * Updates the user's access token in localstorage.
     * @param accessToken The new access token.
     */
    writeToken: (accessToken: string) => {
        localStorage.setItem(PERSONAL_FINANCE_ACCESS_TOKEN, accessToken);
    },

    /**
     * Retrieves the users stored access token if available from a previous session.
     * @returns The stored access token or null.
     */
    getToken: () => {
        try {
            const token = localStorage.getItem(PERSONAL_FINANCE_ACCESS_TOKEN);
            return token;
        } catch (error) {
            return null;
        }
    },
});
