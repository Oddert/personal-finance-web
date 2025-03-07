import * as jwt from 'jwt-decode';

import APIService from '../services/APIService';
import { AuthLSService } from '../services/AuthLSService';

import { authenticateUser, writeUserDetails } from '../redux/slices/authSlice';
import { userUnauthenticated } from '../redux/thunks/authThunks';

import { useAppDispatch } from './ReduxHookWrappers';

const timeoutOffset = 1000 * 60 * 1;

/**
 * Handles authentication loading and refresh as part of application main lifecycle.
 * @category Hooks
 * @subcategory Use Auth Token
 */
const useAuthToken = () => {
    const dispatch = useAppDispatch();

    /**
     * Internal function to fetch the user details and authenticate them.
     * @param accessToken The retrieved access token.
     * @param decoded The decoded token body.
     * @param callback Optional function called after the user has been successfully authenticated.
     * @returns The result of the callback or null if none provided.
     */
    // We'll allow underscore names to clearly show distinction for internal vs external methods.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _authenticate = async (
        accessToken: string,
        decoded: jwt.JwtPayload,
        callback?: () => void,
    ) => {
        dispatch(
            authenticateUser({
                accessToken,
                accessTokenExpires: decoded.exp || 0,
            }),
        );

        const userDetailsResponse = await APIService.userDetails();

        if (!userDetailsResponse.payload?.user) {
            throw new Error('Issue encountered trying to query user details.');
        }

        dispatch(
            writeUserDetails({
                user: userDetailsResponse.payload?.user,
            }),
        );

        return callback ? callback() : null;
    };

    /**
     * In the event a queried access token is invalid, attempts to use the refresh token to query a new one.
     *
     * If this is not possible the user auth details are wiped and the user is directed to login again.
     */
    const refreshToken = () => {
        // TODO: implement refresh tokens
        dispatch(userUnauthenticated());
    };

    /**
     * Checks the stored access token and either re-authenticates the user, or directs them to the login page.
     *
     * Intended for initial app loads.
     * @param callback Optional function called after the user has been successfully authenticated.
     * @returns The result of the callback function if provided or void.
     */
    const conditionallyRefreshAuth = async (callback?: () => void) => {
        const accessToken = AuthLSService.getToken();
        if (!accessToken) {
            return refreshToken();
        }
        try {
            const decoded = jwt.jwtDecode(accessToken);

            if (
                !decoded?.exp ||
                decoded.exp <= new Date().getTime() + timeoutOffset
            ) {
                return refreshToken();
            }

            return await _authenticate(accessToken, decoded, callback);
        } catch (error) {
            return refreshToken();
        }
    };

    return {
        conditionallyRefreshAuth,
        refreshToken,
    };
};

export default useAuthToken;
