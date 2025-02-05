import { createSlice } from '@reduxjs/toolkit';

import { ILanguage } from '../../types/Intl.types';

export interface IProfileState {
    activeLanguage: ILanguage;
    languages: ILanguage[];
    currencies: string[];
}

export const initialState: IProfileState = {
    activeLanguage: { code: 'en-GB', displayName: 'English (standard)' },
    languages: [{ code: 'en-GB', displayName: 'English (standard)' }],
    currencies: ['GPB', 'USD', 'EUR'],
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setActiveLanguage: (
            state,
            { payload }: { payload: { language: ILanguage } },
        ) => {
            state.activeLanguage = payload.language;
        },
        updateCurrencies: (
            state,
            { payload }: { payload: { currencies: string[] } },
        ) => {
            state.currencies = payload.currencies;
        },
        updateLanguages: (
            state,
            { payload }: { payload: { languages: ILanguage[] } },
        ) => {
            state.languages = payload.languages;
        },
    },
});

export const { setActiveLanguage, updateCurrencies, updateLanguages } =
    profileSlice.actions;

export default profileSlice.reducer;
