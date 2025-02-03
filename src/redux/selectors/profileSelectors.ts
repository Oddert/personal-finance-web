import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../constants/store';

const getProfileState = (state: RootState) => state.profile;

/**
 * Gets the current language setting enabled for the user.
 */
export const getActiveLanguage = createSelector(
    getProfileState,
    (profileState) => profileState.activeLanguage,
);

/**
 * A list of the user's preferred languages (minimum of one item guaranteed).
 */
export const getUserLanguages = createSelector(
    getProfileState,
    (profileState) => profileState.languages,
);

/**
 * A list of the user's preferred currencies (may be empty).
 */
export const getUserCurrencies = createSelector(
    getProfileState,
    (profileState) => profileState.currencies,
);
