import type { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import APIService from '../../services/APIService';

import type { Category } from '../../types/Category';
import type { Matcher } from '../../types/Matcher';
import type { IStandardResponse } from '../../types/Request';

import { deleteSingleMatcher } from '../slices/categorySlice';

/**
 * Deletes a matcher and updates the Category in state.
 */
export default function* matcherDeleteSingleSaga({
    payload,
}: PayloadAction<{
    matcherId: Matcher['id'];
    categoryId: Category['id'];
}>) {
    try {
        const response: IStandardResponse<{ error?: string }> =
            yield APIService.deleteSingleMatcher(payload.matcherId);

        if (response.error) {
            console.error(response?.payload?.error);
        } else {
            yield put(deleteSingleMatcher(payload));
        }
    } catch (error) {
        console.error(error);
    }
}
