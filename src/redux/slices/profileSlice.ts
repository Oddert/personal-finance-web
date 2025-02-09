import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ILanguage } from '../../types/Intl.types';

export interface IProfileState {
    activeLanguage: ILanguage;
    languages: ILanguage[];
    currencies: string[];
}

export const initialState: IProfileState = {
    activeLanguage: { code: 'en-GB', displayName: 'English (standard)' },
    languages: [{ code: 'en-GB', displayName: 'English (standard)' }],
    currencies: ['GBP', 'USD', 'EUR'],
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        reorderCurrencies: (
            state,
            { payload }: PayloadAction<{ from: number; to: number }>,
        ) => {
            const temp = state.currencies[payload.to];
            state.currencies[payload.to] = state.currencies[payload.from];
            state.currencies[payload.from] = temp;
        },
        reorderLanguages: (
            state,
            { payload }: PayloadAction<{ from: number; to: number }>,
        ) => {
            const temp = state.languages[payload.to];
            state.languages[payload.to] = state.languages[payload.from];
            state.languages[payload.from] = temp;
        },
        setActiveLanguage: (
            state,
            { payload }: PayloadAction<{ language: ILanguage }>,
        ) => {
            state.activeLanguage = payload.language;
        },
        updateCurrencies: (
            state,
            { payload }: PayloadAction<{ currencies: string[] }>,
        ) => {
            state.currencies = payload.currencies;
        },
        updateLanguages: (
            state,
            { payload }: PayloadAction<{ languages: ILanguage[] }>,
        ) => {
            state.languages = payload.languages;
        },
    },
});

export const {
    reorderCurrencies,
    reorderLanguages,
    setActiveLanguage,
    updateCurrencies,
    updateLanguages,
} = profileSlice.actions;

export default profileSlice.reducer;
