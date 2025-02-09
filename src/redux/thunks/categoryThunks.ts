import APIService from '../../services/APIService';
import { sortCategories } from '../../utils/categoryUtils';

import { AppDispatch, RootState } from '../constants/store';

import { requestCategories, writeCategories } from '../slices/categorySlice';

import { intakeError } from './errorThunks';

/**
 * Conditional re-requests the category state from the server.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshCategories =
    (override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();

            if (override || !state.category.queried) {
                dispatch(requestCategories());
                const response = await APIService.getAllCategories();
                if (!response || !response.payload) {
                    throw new Error('No response received from the server.');
                }
                if (response?.status === 200) {
                    const orderedData = sortCategories(
                        response.payload.categories,
                    );
                    dispatch(
                        writeCategories({
                            categories: response.payload.categories,
                            orderedData,
                        }),
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
