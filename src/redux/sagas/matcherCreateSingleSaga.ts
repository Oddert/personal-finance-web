import type { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import APIService from '../../services/APIService';

import type { ICategory } from '../../types/Category.d';
import type { IMatcher } from '../../types/Matcher.d';
import type { IStandardResponse } from '../../types/Request.d';

import { createSingleMatcher } from '../slices/categorySlice';

import { intakeError } from '../thunks/errorThunks';

/**
 * Adds a single matcher and updates it in state.
 */
export default function* matcherCreateSingleSaga({
    payload,
}: PayloadAction<{
    matcher: Partial<IMatcher>;
    categoryId: ICategory['id'];
}>) {
    try {
        const response: IStandardResponse<{ matcher: IMatcher }> =
            yield APIService.addSingleMatcher(
                payload.matcher,
                payload.categoryId,
            );

        if (response.error || !response.payload) {
            console.error(response?.error);
            yield put(intakeError(response.error));
        } else {
            yield put(
                createSingleMatcher({
                    matcher: response.payload.matcher,
                    categoryId: payload.categoryId,
                }),
            );
        }
    } catch (error) {
        console.error(error);
        yield put(intakeError(error));
    }
}
