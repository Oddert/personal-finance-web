import { put } from 'redux-saga/effects';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Category } from '../../types/Category';
import type { IStandardResponse } from '../../types/Request';

import APIService from '../../services/APIService';

import { deleteSingleCategory } from '../slices/categorySlice';

/**
 * Deletes a category and updates the state.
 */
export default function* categoryDeleteSingleSaga({
    payload,
}: PayloadAction<{
    categoryId: Category['id'];
}>) {
    try {
        const response: IStandardResponse<{ error?: string }> =
            yield APIService.deleteSingleMatcher(payload.categoryId);

        if (response.error) {
            console.error(response?.payload?.error);
        } else {
            yield put(deleteSingleCategory(payload));
        }
    } catch (error) {
        console.error(error);
    }
}
