import {
    PERSONAL_FINANCE_ACCESS_TOKEN,
    PERSONAL_FINANCE_REFRESH_TOKEN,
} from '../constants/appConstants';

/**
 * Provides an abstracted interface for the AUth localstorage.
 */
export const AuthLSService = Object.freeze({
    /**
     * Clears the access token key for a logout.
     */
    deleteAccessToken: () => {
        try {
            localStorage.removeItem(PERSONAL_FINANCE_ACCESS_TOKEN);
        } catch (error) {
            return null;
        }
    },

    /**
     * Clears the refresh token key for a logout.
     */
    deleteRefreshToken: () => {
        try {
            localStorage.removeItem(PERSONAL_FINANCE_REFRESH_TOKEN);
        } catch (error) {
            return null;
        }
    },

    /**
     * Retrieves the users stored access token if available from a previous session.
     * @returns The stored access token or null.
     */
    getAccessToken: () => {
        try {
            const token = localStorage.getItem(PERSONAL_FINANCE_ACCESS_TOKEN);
            return token;
        } catch (error) {
            return null;
        }
    },

    /**
     * Retrieves the users stored refresh token if available from a previous session.
     * @returns The stored access token or null.
     */
    getRefreshToken: () => {
        try {
            const token = localStorage.getItem(PERSONAL_FINANCE_REFRESH_TOKEN);
            return token;
        } catch (error) {
            return null;
        }
    },

    /**
     * Updates the user's access token in localstorage.
     * @param accessToken The new access token.
     */
    writeAccessToken: (accessToken: string) => {
        localStorage.setItem(PERSONAL_FINANCE_ACCESS_TOKEN, accessToken);
    },

    /**
     * Updates the user's refresh token in localstorage.
     * @param accessToken The new access token.
     */
    writeRefreshToken: (accessToken: string) => {
        localStorage.setItem(PERSONAL_FINANCE_REFRESH_TOKEN, accessToken);
    },
});
