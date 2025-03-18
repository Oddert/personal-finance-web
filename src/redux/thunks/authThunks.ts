import * as jwt from 'jwt-decode';

import APIService from '../../services/APIService';

import { AppDispatch } from '../constants/store';
import router, { ROUTES } from '../../constants/routerConstants';

import { IUser } from '../../types/Auth.types';
import { IStandardResponse } from '../../types/Request.d';

import { AuthLSService } from '../../services/AuthLSService';

import {
    authenticateUser,
    clearAuthentication,
    setIncorrectDetails,
    writeUserDetails,
} from '../slices/authSlice';

import { intakeError } from './errorThunks';

/**
 * Lower-order thunk to handle the result of a successful login.
 * @category Redux
 * @subcategory Thunks
 * @param response The API response.
 */
export const handleAuthResponse =
    (
        response: IStandardResponse<{
            accessToken: string;
            refreshToken: string;
            user: IUser;
        }>,
    ) =>
    async (dispatch: AppDispatch) => {
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
        } catch (error: any) {
            if (error.status === 404) {
                dispatch(setIncorrectDetails());
            } else {
                dispatch(intakeError(error));
            }
        }
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
 * Logs out a user, clears their stored details, and redirects them to the login page.
 * @category Redux
 * @subcategory Thunks
 */
export const userUnauthenticated = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(clearAuthentication());
        router.navigate(ROUTES.LOGIN);
    } catch (error) {
        dispatch(intakeError(error));
    }
};

/**
 * Attempts to refresh the user's authentication using the stored refresh token.
 * @category Redux
 * @subcategory Thunks
 */
export const refreshAuthentication = () => async (dispatch: AppDispatch) => {
    try {
        const refreshToken = AuthLSService.getRefreshToken();

        if (!refreshToken) {
            dispatch(userUnauthenticated());
            return;
        }

        const response = await APIService.refreshToken(refreshToken);

        dispatch(handleAuthResponse(response));
    } catch (error: any) {
        if (error.status === 404) {
            dispatch(setIncorrectDetails());
        } else {
            dispatch(intakeError(error));
        }
    }
};
