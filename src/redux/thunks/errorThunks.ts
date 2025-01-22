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
        if (error instanceof AxiosError) {
            // Condition 1: If a network error is caught we want to extract specific network info for the user.
            if (
                error?.response?.data &&
                !/<\!DOCTYPE html>/.test(error.response.data)
            ) {
                // Condition 1.1: If the error is coming from our backend (request gets through at least), use our standard response format.
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
            } else {
                // Condition 1.2: If the request failed to reach our backend or an unhandled error occurs, use Axios's response info.
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
                                error: error.cause,
                                stackTrace: error.stack,
                            },
                        ),
                    ),
                );
            }
        } else if (error instanceof Error) {
            // Condition 2: Non network error but conforming to a standard JS error.
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
            // Condition 3: No recognisable error format found.
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
        // Condition 4: Should any assumption in the 'try' block fail, create a generic error and log the contents.
        console.error(err);
        dispatch(
            writeError({
                title: 'Something went wrong and the application could not recover.',
                message:
                    'An unexpected error was encountered for which the application could not find a cause.',
                error: 'Fatal Application error',
                stackTrace: '',
            }),
        );
    }
};
