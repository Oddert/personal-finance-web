import * as jwt from 'jwt-decode';

import APIService from '../../services/APIService';

import { AppDispatch, RootState } from '../constants/store';
import router, { ROUTES_FACTORY } from '../../constants/routerConstants';

import { IUser } from '../../types/Auth.types';
import { IStandardResponse } from '../../types/Request.d';

import { AuthLSService } from '../../services/AuthLSService';

import { createLoginAddrWithReturn } from '../../utils/routingUtils';

import {
    authenticateUser,
    clearAuthentication,
    logoutAuth,
    refreshTokenRequestFinished,
    refreshTokenRequestPending,
    setIncorrectDetails,
    writeUserDetails,
} from '../slices/authSlice';
import {
    getRefreshTokenPending,
    getUserEmail,
    getUserFirstName,
    getUserLastName,
} from '../selectors/authSelectors';

import {
    getActiveLanguage,
    getUserCurrencies,
    getUserLanguages,
} from '../selectors/profileSelectors';
import { writeUserProfile } from '../slices/profileSlice';

import { intakeError } from './errorThunks';

/**
 * Lower-order thunk to handle the result of a successful login.
 * @category Redux
 * @subcategory Thunks
 * @param response The API response.
 */
export const handleAuthResponse = (
    response: IStandardResponse<{
        accessToken: string;
        refreshToken: string;
        user: IUser;
    }>,
    callback?: () => void,
) => {
    return async (dispatch: AppDispatch) => {
        try {
            if (!response.payload?.accessToken) {
                throw new Error(
                    'No valid token received when trying to login.',
                );
            }

            const accessDecoded = jwt.jwtDecode(response.payload?.accessToken);
            const refreshDecoded = jwt.jwtDecode(
                response.payload?.refreshToken,
            );

            AuthLSService.writeAccessToken(response.payload.accessToken);
            AuthLSService.writeRefreshToken(response.payload.refreshToken);
            dispatch(
                authenticateUser({
                    accessToken: response.payload?.accessToken,
                    accessTokenExpires: accessDecoded.exp || 0,
                    refreshToken: response.payload?.refreshToken,
                    refreshTokenExpires: refreshDecoded.exp || 0,
                }),
            );

            dispatch(
                writeUserDetails({
                    user: response.payload.user,
                }),
            );
            dispatch(writeUserProfile({ user: response.payload?.user }));

            if (callback) {
                callback();
            }
        } catch (error: any) {
            if (error.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(intakeError(error));
            }
        }
    };
};
/**
 * Attempts to log in the user and fetch the user's details.
 * @category Redux
 * @subcategory Thunks
 * @param username The user-entered username.
 * @param password The user-entered password.
 */
export const loginUser =
    (username: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            const response = await APIService.loginUser(username, password);

            if (response.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(handleAuthResponse(response));
            }
        } catch (error: any) {
            if (error.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(intakeError(error));
            }
        }
    };

/**
 * Attempts to register a new user account.
 * @category Redux
 * @subcategory Thunks
 * @param username The user-entered username.
 * @param password The user-entered password.
 */
export const registerUser =
    (
        username: string,
        password: string,
        displayName: string,
        languages: string,
    ) =>
    async (dispatch: AppDispatch) => {
        try {
            const response = await APIService.registerUser(
                username,
                password,
                displayName,
                languages,
            );

            if (response.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(handleAuthResponse(response));
            }
        } catch (error: any) {
            if (error.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(intakeError(error));
            }
        }
    };

/**
 * Logs out a user, clears their stored details, and redirects them to the login page.
 * @category Redux
 * @subcategory Thunks
 */
export const userUnauthenticated = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(clearAuthentication());
        router.navigate(createLoginAddrWithReturn());
    } catch (error) {
        dispatch(intakeError(error));
    }
};

/**
 * Attempts to refresh the user's authentication using the stored refresh token.
 * @category Redux
 * @subcategory Thunks
 */
export const refreshAuthentication = (callback?: () => void) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const refreshRequestPending = getRefreshTokenPending(getState());

            if (refreshRequestPending) {
                return;
            }

            dispatch(refreshTokenRequestPending());
            const refreshToken = AuthLSService.getRefreshToken();

            if (!refreshToken) {
                dispatch(userUnauthenticated());
                return;
            }

            const response = await APIService.refreshToken(refreshToken);

            if (response.status === 401 || response.status === 403) {
                dispatch(userUnauthenticated());
                router.navigate(
                    ROUTES_FACTORY.LOGIN(
                        `${window.location.pathname}${window.location.search}`,
                    ),
                );
            } else {
                dispatch(handleAuthResponse(response, callback));
            }
        } catch (error: any) {
            if (error.status === 401 || error.status === 403) {
                dispatch(userUnauthenticated());
                router.navigate(createLoginAddrWithReturn());
            } else if (error.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(intakeError(error));
            }
            dispatch(refreshTokenRequestFinished());
        }
    };
};

/**
 * Checks the current time against the user's auth token expiry and conditionally refreshes the auth.
 *
 * Intended to be dispatched frequently as a way of verifying the user's auth before a potential action which will result in a logout.
 *
 * By default it will attempt to refresh if the token if the current token is less than 1 minute from expiry. This can be overridden by the `margin` argument.
 * @category Redux
 * @subcategory Thunks
 * @param margin Minimum time in milliseconds to the token's expiry. (default 120_000ms)
 */
export const checkAuth =
    (margin?: number) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            if (
                state.auth.accessTokenExpires <=
                new Date().getTime() - (margin || 120_000)
            ) {
                dispatch(refreshAuthentication());
            }
        } catch (error: any) {
            if (error.status === 401 || error.status === 403) {
                dispatch(userUnauthenticated());
                router.navigate(createLoginAddrWithReturn());
            } else if (error.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(intakeError(error));
            }
        }
    };

/**
 * Updates non-security related user details such as email, languages, display name etc.
 *
 * Will populate any omitted fields using the stored redux state values.
 *
 * Will use empty strings to satisfy type safety requirements. Expect an error to be thrown if any values are not present or valid in the state.
 * @category Redux
 * @subcategory Thunks
 * @param margin Minimum time in milliseconds to the token's expiry.
 */
export const updateUserDetails =
    ({
        email,
        firstName,
        lastName,
        languages,
        activeLang,
        currencies,
    }: {
        email?: string;
        firstName?: string;
        lastName?: string;
        languages?: string[];
        activeLang?: string;
        currencies?: string[];
    }) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const currentUsername = getUserEmail(state);
            const currentFirstName = getUserFirstName(state);
            const currentLastName = getUserLastName(state);
            const currentLangs = getUserLanguages(state);
            const currentActiveLang = getActiveLanguage(state);
            const currentCurrency = getUserCurrencies(state);

            const response = await APIService.updateUserDetails(
                email || currentUsername || '',
                firstName || currentFirstName || '',
                lastName || currentLastName || '',
                languages
                    ? languages.join(',')
                    : currentLangs.map((lang) => lang.code).join(','),
                activeLang || currentActiveLang.code,
                (currencies || currentCurrency).join(','),
                (currencies || currentCurrency)[0],
            );

            if (response.payload) {
                dispatch(writeUserProfile({ user: response.payload?.user }));
                dispatch(writeUserDetails({ user: response.payload?.user }));
            }
        } catch (error: any) {
            dispatch(intakeError(error));
        }
    };

/**
 * Logs the user out and clears user details.
 * @category Redux
 * @subcategory Thunks
 */
export const userLogout = () => async (dispatch: AppDispatch) => {
    try {
        AuthLSService.deleteAccessToken();
        AuthLSService.deleteRefreshToken();
        dispatch(logoutAuth());
    } catch (error: any) {
        dispatch(intakeError(error));
    }
};
