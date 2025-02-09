import { put } from 'redux-saga/effects';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Category } from '../../types/Category.d';
import type { IStandardResponse } from '../../types/Request.d';

import APIService from '../../services/APIService';

import { deleteSingleCategory } from '../slices/categorySlice';
import { intakeError } from '../thunks/errorThunks';

/**
 * Deletes a category and updates the state.
 */
export default function* categoryDeleteSingleSaga({
    payload,
}: PayloadAction<{
    categoryId: Category['id'];
}>): any {
    try {
        const response: IStandardResponse<{ error?: string }> =
            yield APIService.deleteSingleMatcher(payload.categoryId);

        if (response.error) {
            console.error(response?.payload?.error);
            yield put(intakeError(response.error));
        } else {
            yield put(deleteSingleCategory(payload));
        }
    } catch (error) {
        console.error(error);
        yield put(intakeError(error));
    }
}
