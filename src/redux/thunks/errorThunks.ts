import { AxiosError } from 'axios';
import { AppDispatch } from '../constants/store';

import { IPayloadWriteError, writeError } from '../slices/errorSlice';

/**
 * Writes the error boundary with default attributes set.
 * @category Redux
 * @subcategory Thunks
 * @param errorArgs Message components to override defaults.
 */
export const writeErrorBoundary =
    (errorArgs: Partial<IPayloadWriteError>) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(
                writeError(
                    Object.assign(
                        {
                            title: 'Something went wrong',
                            message: 'An unexpected error was encountered.',
                            error: 'Application error',
                            stackTrace: '',
                        },
                        errorArgs,
                    ),
                ),
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

/**
 * Ingests and attempts to parse a series of expected errors, with preference to particular error messages.
 *
 * Priority order:
 * - On standard API responses, use our standard response object.
 * - On failed API responses (e.g. network error or incorrect path 404), use Axios error attributes.
 * - On all other errors inherited from the JS Error, use Error attributes.
 * - Default back to a generic 'something went wrong' message.
 * @category Redux
 * @subcategory Thunks
 * @param errorArgs Message components to override defaults.
 */
export const intakeError = (error: any) => async (dispatch: AppDispatch) => {
    try {
        if (
            error instanceof AxiosError &&
            error?.response?.data &&
            !/<\!DOCTYPE html>/.test(error.response.data)
        ) {
            dispatch(
                writeError(
                    Object.assign(
                        {
                            title: 'Something went wrong',
                            message: 'An unexpected error was encountered.',
                            error: 'Application error',
                            stackTrace: '',
                        },
                        {
                            title: error.name,
                            message: error.response.data.message,
                            error: error.response.data.error,
                            stackTrace: error.stack,
                        },
                    ),
                ),
            );
        } else if (error instanceof Error) {
            dispatch(
                writeError(
                    Object.assign(
                        {
                            title: 'Something went wrong',
                            message: 'An unexpected error was encountered.',
                            error: 'Application error',
                            stackTrace: '',
                        },
                        {
                            title: error.name,
                            message: error.message,
                            error: String(error),
                            stackTrace: error.stack,
                        },
                    ),
                ),
            );
        } else {
            dispatch(
                writeError({
                    title: 'Something went wrong',
                    message: 'An unexpected error was encountered.',
                    error: 'Application error',
                    stackTrace: '',
                }),
            );
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};
