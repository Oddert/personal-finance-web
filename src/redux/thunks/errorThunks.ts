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
