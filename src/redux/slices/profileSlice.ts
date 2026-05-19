import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import locale from 'locale-codes';

import type { IUser } from '../../types/Auth.types';
import type { ILanguage } from '../../types/Intl.types';
import type { TSidebarMode } from '../../types/Profile.types';

export interface IProfileState {
    activeLanguage: ILanguage;
    languages: ILanguage[];
    currencies: string[];
    sidebarMode: TSidebarMode;
}

export const initialState: IProfileState = {
    activeLanguage: { code: 'en-GB', displayName: 'English (standard)' },
    languages: [{ code: 'en-GB', displayName: 'English (standard)' }],
    currencies: ['GBP', 'USD', 'EUR'],
    sidebarMode: 'discreet',
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        changeSidebarMode: (
            state,
            { payload }: PayloadAction<{ mode: TSidebarMode }>,
        ) => {
            state.sidebarMode = payload.mode;
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
        writeUserProfile(state, { payload }: { payload: { user: IUser } }) {
            state.activeLanguage = {
                code: payload.user.defaultLang,
                displayName: locale.getByTag(payload.user.defaultLang).name,
            };
            state.languages = payload.user.languages
                .split(',')
                .map((langCode) => {
                    const code = langCode.trim();
                    return {
                        code,
                        displayName: locale.getByTag(code).name,
                    };
                });

            state.currencies = payload.user.languages
                .split(',')
                .map((currency) => currency.trim());
        },
    },
});

export const {
    changeSidebarMode,
    setActiveLanguage,
    updateCurrencies,
    updateLanguages,
    writeUserProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
