import { ILanguage } from '../../types/Intl.types';

import { AppDispatch } from '../constants/store';

import { setActiveLanguage } from '../slices/profileSlice';
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
