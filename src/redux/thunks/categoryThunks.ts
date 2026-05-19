import type { ICategory } from '../../types/Category.d';
import type { IMatcher } from '../../types/Matcher.d';
import type { AppDispatch, RootState } from '../constants/store';
import type { TFunction } from 'i18next';

import APIService from '../../services/APIService';
import APIServiceNoInterceptors from '../../services/APIServiceNoInterceptors';
import { sortCategories } from '../../utils/categoryUtils';
import {
    createCategory,
    createSingleMatcher,
    deleteSingleCategory,
    requestCategories,
    updateSingleCategory,
    writeCategories,
} from '../slices/categorySlice';

import { refreshAuthentication } from './authThunks';
import { intakeError } from './errorThunks';

/**
 * Conditional re-requests the category state from the server.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshCategories =
    (t: TFunction, override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();

            if (override || !state.category.queried) {
                dispatch(requestCategories());
                const response = await APIService.getAllCategories();
                if (!response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                if (response.status === 200) {
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
            dispatch(intakeError(error));
        }
    };

/**
 * Creates a new Category and updates the held list.
 * @param category The new Category.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const categoryCreateAction =
    (category: Partial<ICategory>, allowReRequest = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.createCategory(category);

            if (!response.data.error && response.data.payload) {
                dispatch(
                    createCategory({
                        category: response.data.payload.category,
                    }),
                );
            }
        } catch (error1) {
            try {
                // @ts-expect-error error handling logic requires review
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryCreateAction(category));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2) {
                dispatch(intakeError(error2));
            }
        }
    };

/**
 * Updates a single Category.
 * @param category The Category to update. Must include a valid ID.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const categoryUpdateAction =
    (category: Partial<ICategory>, allowReRequest = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.updateCategory(category);

            if (!response.data.error && response.data.payload) {
                dispatch(
                    updateSingleCategory({
                        category: response.data.payload.category,
                    }),
                );
            }
        } catch (error1) {
            try {
                // @ts-expect-error error handling logic requires review
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryUpdateAction(category));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2) {
                dispatch(intakeError(error2));
            }
        }
    };

/**
 * Deletes a single Category and removes it from state.
 * @param categoryId The ID of the Category to delete.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const categoryDeleteAction =
    (categoryId: string, allowReRequest = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.deleteSingleCategory(categoryId);

            if (!response.data.error && response.data.payload) {
                dispatch(deleteSingleCategory({ categoryId }));
            }
        } catch (error1) {
            try {
                // @ts-expect-error error handling logic requires review
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryDeleteAction(categoryId));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2) {
                dispatch(intakeError(error2));
            }
        }
    };

/**
 * Creates a new Category and updates the held list.
 * @param category The new Category.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const matcherCreateAction =
    (
        matcher: Partial<IMatcher>,
        categoryId: ICategory['id'],
        allowReRequest = false,
    ) =>
    async (dispatch: AppDispatch) => {
        try {
            const response = await APIServiceNoInterceptors.createSingleMatcher(
                matcher,
                categoryId,
            );

            if (!response.data.error && response.data.payload) {
                dispatch(
                    createSingleMatcher({
                        matcher: response.data.payload.matcher,
                        categoryId,
                    }),
                );
            }
        } catch (error1) {
            try {
                // @ts-expect-error error handling logic requires review
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(matcherCreateAction(matcher, categoryId));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2) {
                dispatch(intakeError(error2));
            }
        }
    };

/**
 * Updates a single Category.
 * @param category The Category to update. Must include a valid ID.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const matcherUpdateAction =
    (category: Partial<ICategory>, allowReRequest = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.updateCategory(category);

            if (!response.data.error && response.data.payload) {
                dispatch(
                    updateSingleCategory({
                        category: response.data.payload.category,
                    }),
                );
            }
        } catch (error1) {
            try {
                // @ts-expect-error error handling logic requires review
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryUpdateAction(category));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2) {
                dispatch(intakeError(error2));
            }
        }
    };

/**
 * Deletes a single Category and removes it from state.
 * @param categoryId The ID of the Category to delete.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const matcherDeleteAction =
    (categoryId: string, allowReRequest = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.deleteSingleCategory(categoryId);

            if (!response.data.error && response.data.payload) {
                dispatch(deleteSingleCategory({ categoryId }));
            }
        } catch (error1) {
            try {
                // @ts-expect-error error handling logic requires review
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryDeleteAction(categoryId));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2) {
                dispatch(intakeError(error2));
            }
        }
    };
