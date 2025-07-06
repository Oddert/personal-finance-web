import { TFunction } from 'i18next';

import { ICategory } from '../../types/Category.d';
import { IMatcher } from '../../types/Matcher.d';

import { AppDispatch, RootState } from '../constants/store';

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

import { intakeError } from './errorThunks';
import { refreshAuthentication } from './authThunks';

/**
 * Conditional re-requests the category state from the server.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshCategories =
    (t: TFunction<'translation', undefined>, override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();

            if (override || !state.category.queried) {
                dispatch(requestCategories());
                const response = await APIService.getAllCategories();
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
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

/**
 * Creates a new Category and updates the held list.
 * @param category The new Category.
 * @param allowReRequest If true a re-request will be tried if the authentication expires.
 */
export const categoryCreateAction =
    (category: Partial<ICategory>, allowReRequest: boolean = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.createCategory(category);

            if (!response.error && response.payload) {
                dispatch(
                    createCategory({ category: response.payload.category }),
                );
            }
        } catch (error1: any) {
            try {
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryCreateAction(category));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2: any) {
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
    (category: Partial<ICategory>, allowReRequest: boolean = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.updateCategory(category);

            if (!response.error && response.payload) {
                dispatch(
                    updateSingleCategory({
                        category: response.payload.category,
                    }),
                );
            }
        } catch (error1: any) {
            try {
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryUpdateAction(category));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2: any) {
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
    (categoryId: string, allowReRequest: boolean = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.deleteSingleCategory(categoryId);

            if (!response.error && response.payload) {
                dispatch(deleteSingleCategory({ categoryId }));
            }
        } catch (error1: any) {
            try {
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryDeleteAction(categoryId));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2: any) {
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
        allowReRequest: boolean = false,
    ) =>
    async (dispatch: AppDispatch) => {
        try {
            const response = await APIServiceNoInterceptors.createSingleMatcher(
                matcher,
                categoryId,
            );

            if (!response.error && response.payload) {
                dispatch(
                    createSingleMatcher({
                        matcher: response.payload.matcher,
                        categoryId,
                    }),
                );
            }
        } catch (error1: any) {
            try {
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(matcherCreateAction(matcher, categoryId));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2: any) {
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
    (category: Partial<ICategory>, allowReRequest: boolean = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.updateCategory(category);

            if (!response.error && response.payload) {
                dispatch(
                    updateSingleCategory({
                        category: response.payload.category,
                    }),
                );
            }
        } catch (error1: any) {
            try {
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryUpdateAction(category));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2: any) {
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
    (categoryId: string, allowReRequest: boolean = false) =>
    async (dispatch: AppDispatch) => {
        try {
            const response =
                await APIServiceNoInterceptors.deleteSingleCategory(categoryId);

            if (!response.error && response.payload) {
                dispatch(deleteSingleCategory({ categoryId }));
            }
        } catch (error1: any) {
            try {
                if (error1.status === 401 && allowReRequest) {
                    dispatch(
                        refreshAuthentication(() => {
                            dispatch(categoryDeleteAction(categoryId));
                        }),
                    );
                } else {
                    dispatch(intakeError(error1));
                }
            } catch (error2: any) {
                dispatch(intakeError(error2));
            }
        }
    };
