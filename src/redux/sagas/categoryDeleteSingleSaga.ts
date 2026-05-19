/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import type { ICategory } from '../../types/Category.d';

import APIService from '../../services/APIService';
import { retry } from '../../utils/requestUtils';
import { deleteSingleCategory } from '../slices/categorySlice';
import { intakeError } from '../thunks/errorThunks';

/**
 * Deletes a category and updates the state.
 * @deprecated
 */
export default function* categoryDeleteSingleSaga({
    payload,
}: PayloadAction<{
    categoryId: ICategory['id'];
}>): unknown {
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
