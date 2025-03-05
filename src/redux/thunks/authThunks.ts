import * as jwt from 'jwt-decode';

import APIService from '../../services/APIService';

import { AppDispatch } from '../constants/store';
import {
    authenticateUser,
    setIncorrectDetails,
    writeUserDetails,
} from '../slices/authSlice';

import { AuthLSService } from '../../services/AuthLSService';

import { intakeError } from './errorThunks';

/**
 * Attempts to log in the user and fetch the user's details.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const loginUser =
    (username: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            const response = await APIService.loginUser(username, password);

            if (!response.payload?.accessToken) {
                throw new Error(
                    'No valid token received when trying to login.',
                );
            }

            const decoded = jwt.jwtDecode(response.payload?.accessToken);

            AuthLSService.writeToken(response.payload.accessToken);
            dispatch(
                authenticateUser({
                    accessToken: response.payload?.accessToken,
                    accessTokenExpires: decoded.exp || 0,
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
