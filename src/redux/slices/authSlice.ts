import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '../../types/Auth.types';

export interface IAuthState {
    accessRequestInProgress: boolean;
    accessToken: string | null;
    accessTokenExpires: number;
    authenticated: boolean;
    incorrectDetails: boolean;
    refreshRequestInProgress: boolean;
    refreshToken: string | null;
    refreshTokenExpires: number;
    user: null | IUser;
}

const initialState: IAuthState = {
    accessRequestInProgress: false,
    accessToken: null,
    accessTokenExpires: 0,
    authenticated: false,
    incorrectDetails: false,
    refreshRequestInProgress: false,
    refreshToken: null,
    refreshTokenExpires: 0,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        accessTokenRequestFinished(state) {
            state.accessRequestInProgress = false;
        },
        accessTokenRequestPending(state) {
            state.accessRequestInProgress = true;
        },
        authenticateUser(
            state,
            {
                payload,
            }: PayloadAction<{
                accessToken: string;
                accessTokenExpires: number;
                refreshToken: string;
                refreshTokenExpires: number;
            }>,
        ) {
            state.accessRequestInProgress = false;
            state.authenticated = true;
            state.incorrectDetails = false;
            state.accessToken = payload.accessToken;
            state.accessTokenExpires = payload.accessTokenExpires;
            state.refreshRequestInProgress = false;
            state.refreshToken = payload.refreshToken;
            state.refreshTokenExpires = payload.refreshTokenExpires;
        },
        clearAuthentication(state) {
            state.accessToken = null;
            state.accessTokenExpires = 0;
            state.authenticated = false;
            state.user = null;
        },
        clearIncorrectDetails(state) {
            state.incorrectDetails = false;
        },
        refreshTokenRequestFinished(state) {
            state.refreshRequestInProgress = false;
        },
        refreshTokenRequestPending(state) {
            state.refreshRequestInProgress = true;
        },
        setIncorrectDetails(state) {
            state.incorrectDetails = true;
        },
        writeUserDetails(
            state,
            {
                payload,
            }: PayloadAction<{
                user: IUser;
            }>,
        ) {
            state.user = payload.user;
        },
    },
});

export const {
    authenticateUser,
    clearAuthentication,
    clearIncorrectDetails,
    refreshTokenRequestFinished,
    refreshTokenRequestPending,
    setIncorrectDetails,
    writeUserDetails,
} = authSlice.actions;

export default authSlice.reducer;
