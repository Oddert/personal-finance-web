import * as jwt from 'jwt-decode';

import APIService from '../services/APIService';
import { AuthLSService } from '../services/AuthLSService';

import { authenticateUser, writeUserDetails } from '../redux/slices/authSlice';
import { userUnauthenticated } from '../redux/thunks/authThunks';

import { useAppDispatch } from './ReduxHookWrappers';

const timeoutOffset = 1000 * 60 * 1;

const useAuthToken = () => {
    const dispatch = useAppDispatch();

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

    const refreshToken = () => {
        // TODO: implement refresh tokens
        dispatch(userUnauthenticated());
    };

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
            refreshToken();
        }
    };

    return {
        conditionallyRefreshAuth,
        refreshToken,
    };
};

export default useAuthToken;
