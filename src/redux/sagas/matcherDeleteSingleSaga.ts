import type { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import APIService from '../../services/APIService';

import type { ICategory } from '../../types/Category.d';
import type { IMatcher } from '../../types/Matcher.d';
import type { IStandardResponse } from '../../types/Request.d';

import { deleteSingleMatcher } from '../slices/categorySlice';

import { intakeError } from '../thunks/errorThunks';
import { retry } from '../../utils/requestUtils';

/**
 * Deletes a matcher and updates the Category in state.
 * @deprecated
 */
export default function* matcherDeleteSingleSaga({
    payload,
}: PayloadAction<{
    matcherId: IMatcher['id'];
    categoryId: ICategory['id'];
}>) {
    try {
        const response: IStandardResponse<{ error?: string }> = yield retry<{
            deleted: number;
        }>(() => APIService.deleteSingleMatcher(payload.matcherId));

        if (response.error) {
            console.error(response?.payload?.error);
            yield put(intakeError(response.error));
        } else {
            yield put(deleteSingleMatcher(payload));
        }
    } catch (error) {
        console.error(error);
        yield put(intakeError(error));
    }
}
