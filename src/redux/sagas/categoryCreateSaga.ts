import { put } from 'redux-saga/effects';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { ICategory } from '../../types/Category.d';

import APIService from '../../services/APIService';

import { retry } from '../../utils/requestUtils';

import { intakeError } from '../thunks/errorThunks';

import { createCategory } from '../slices/categorySlice';

/**
 * Creates a category and adds it to the state.
 * @deprecated
 */
export default function* categoryCreateSaga({
    payload,
}: PayloadAction<{
    category: Partial<ICategory>;
}>): any {
    try {
        const response = yield retry<{ category: ICategory }>(() =>
            APIService.createCategory(payload.category),
        );

        if (response.error || !response.payload) {
            yield put(intakeError(response));
        } else {
            yield put(createCategory({ category: response.payload.category }));
        }
    } catch (error: any) {
        yield put(intakeError(error));
    }
}
