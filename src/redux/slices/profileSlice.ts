import { createSlice } from '@reduxjs/toolkit';

export interface IProfileState {
    activeLanguage: string;
    languages: string[];
    currencies: string[];
}

export const initialState: IProfileState = {
    activeLanguage: 'en-GB',
    languages: ['en-GB'],
    currencies: ['GPB', 'USD', 'EUR'],
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setActiveLanguage: (
            state,
            { payload }: { payload: { language: string } },
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
            { payload }: { payload: { languages: string[] } },
        ) => {
            state.languages = payload.languages;
        },
    },
});

export default profileSlice.reducer;
