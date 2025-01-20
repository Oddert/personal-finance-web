import type { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import APIService from '../../services/APIService';

import type { Category } from '../../types/Category';
import type { Matcher } from '../../types/Matcher';
import type { IStandardResponse } from '../../types/Request';

import { createSingleMatcher } from '../slices/categorySlice';

/**
 * Adds a single matcher and updates it in state.
 */
export default function* matcherCreateSingleSaga({
    payload,
}: PayloadAction<{
    matcher: Partial<Matcher>;
    categoryId: Category['id'];
}>) {
    try {
        const response: IStandardResponse<{ matcher: Matcher }> =
            yield APIService.addSingleMatcher(
                payload.matcher,
                payload.categoryId,
            );

        if (response.error || !response.payload) {
            console.error(response?.error);
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
    }
}
