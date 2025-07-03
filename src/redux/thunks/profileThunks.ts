import { ILanguage } from '../../types/Intl.types';

import { AppDispatch, RootState } from '../constants/store';

import {
    setActiveLanguage,
    updateCurrencies,
    updateLanguages,
} from '../slices/profileSlice';
import { updateUserDetails } from './authThunks';

import { intakeError } from './errorThunks';

/**
 * Changes the active language locally and updates the user details on the database.
 * @category Redux
 * @subcategory Thunks
 * @param language The new language setting.
 */
export const updateActiveLanguage =
    (language: ILanguage) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setActiveLanguage({ language }));
            dispatch(updateUserDetails({ activeLang: language.code }));
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

/**
 * Changes the preferred languages and updates the user details on the database.
 * @category Redux
 * @subcategory Thunks
 * @param languages The new languages list.
 */
export const updateLanguagePreferences =
    (languages: ILanguage[]) => async (dispatch: AppDispatch) => {
        try {
            dispatch(updateLanguages({ languages }));
            dispatch(
                updateUserDetails({
                    languages: languages.map((language) => language.code),
                }),
            );
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

/**
 * Changes the order ot the user's preferred language and updates the user details on the database.
 * @category Redux
 * @subcategory Thunks
 * @param languages The new languages list.
 */
export const reorderLanguages =
    (from: number, to: number) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const languages = [...state.profile.languages];
            const temp = languages[to];
            languages[to] = languages[from];
            languages[from] = temp;
            dispatch(updateLanguagePreferences(languages));
        } catch (error: any) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

/**
 * Changes the preferred currencies and updates the user details on the database.
 * @category Redux
 * @subcategory Thunks
 * @param currencies The new currencies list.
 */
export const updateCurrencyPreferences =
    (currencies: string[]) => async (dispatch: AppDispatch) => {
        try {
            dispatch(updateCurrencies({ currencies }));
            dispatch(
                updateUserDetails({
                    currencies,
                }),
            );
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

/**
 * Changes the order ot the user's preferred currencies and updates the user details on the database.
 * @category Redux
 * @subcategory Thunks
 * @param languages The new languages list.
 */
export const reorderCurrencies =
    (from: number, to: number) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const currencies = [...state.profile.currencies];
            const temp = currencies[to];
            currencies[to] = currencies[from];
            currencies[from] = temp;
            dispatch(updateCurrencyPreferences(currencies));
        } catch (error: any) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
