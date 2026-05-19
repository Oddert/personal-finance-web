/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import type { ICategory } from '../../types/Category.d';
import type { IMatcher } from '../../types/Matcher.d';
import type { IStandardResponse } from '../../types/Request.d';

import APIService from '../../services/APIService';
import { retry } from '../../utils/requestUtils';
import { deleteSingleMatcher } from '../slices/categorySlice';
import { intakeError } from '../thunks/errorThunks';

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
            yield put(intakeError(response.error));
        } else {
            yield put(deleteSingleMatcher(payload));
        }
    } catch (error) {
        console.error(error);
        yield put(intakeError(error));
    }
}
