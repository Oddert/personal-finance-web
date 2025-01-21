import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux state key for 'error'
 * @category Redux
 * @subcategory Budget Slice
 */
export interface IErrorState {
    dialogOpen: boolean;
    title: string;
    message: string;
    error: string;
    stackTrace: string;
    timestamp: number;
}

const initialState: IErrorState = {
    dialogOpen: false,
    title: '',
    message: '',
    error: '',
    stackTrace: '',
    timestamp: 0,
};

export interface IPayloadWriteError {
    title?: string;
    message?: string;
    error?: string;
    stackTrace?: string;
}

export const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        clearError(state) {
            state.dialogOpen = false;
            state.title = '';
            state.message = '';
            state.error = '';
            state.stackTrace = '';
        },
        writeError(state, { payload }: { payload: IPayloadWriteError }) {
            state.dialogOpen = true;
            state.title = payload?.title || 'Something went wrong';
            state.message =
                payload?.message || 'An unexplained error was encountered.';
            state.error = payload?.error || 'Cause unknown';
            state.stackTrace = payload.stackTrace || '';
            state.timestamp = new Date().getTime();
        },
    },
});

export const { clearError, writeError } = errorSlice.actions;

export default errorSlice.reducer;
