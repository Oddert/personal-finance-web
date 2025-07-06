import { put } from 'redux-saga/effects';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { ICategory } from '../../types/Category.d';

import { retry } from '../../utils/requestUtils';

import APIService from '../../services/APIService';

import { intakeError } from '../thunks/errorThunks';

import { deleteSingleCategory } from '../slices/categorySlice';

/**
 * Deletes a category and updates the state.
 * @deprecated
 */
export default function* categoryDeleteSingleSaga({
    payload,
}: PayloadAction<{
    categoryId: ICategory['id'];
}>): any {
    try {
        // const response: IStandardResponse<{ error?: string }> =
        //     yield APIService.deleteSingleMatcher(payload.categoryId);
        const response = yield retry<{ deleted: number }>(() =>
            APIService.deleteSingleMatcher(payload.categoryId),
        );

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
