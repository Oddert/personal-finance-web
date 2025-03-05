import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '../../types/Auth.types';

export interface IAuthState {
    accessToken: string | null;
    accessTokenExpires: number;
    authenticated: boolean;
    incorrectDetails: boolean;
    user: null | IUser;
}

const initialState: IAuthState = {
    accessToken: null,
    accessTokenExpires: 0,
    authenticated: false,
    incorrectDetails: false,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticateUser(
            state,
            {
                payload,
            }: PayloadAction<{
                accessToken: string;
                accessTokenExpires: number;
            }>,
        ) {
            state.authenticated = true;
            state.incorrectDetails = false;
            state.accessToken = payload.accessToken;
            state.accessTokenExpires = payload.accessTokenExpires;
        },
        clearIncorrectDetails(state) {
            state.incorrectDetails = false;
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
    clearIncorrectDetails,
    setIncorrectDetails,
    writeUserDetails,
} = authSlice.actions;

export default authSlice.reducer;
