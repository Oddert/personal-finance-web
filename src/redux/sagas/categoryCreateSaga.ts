/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import type { ICategory } from '../../types/Category.d';

import APIService from '../../services/APIService';
import { retry } from '../../utils/requestUtils';
import { createCategory } from '../slices/categorySlice';
import { intakeError } from '../thunks/errorThunks';

/**
 * Creates a category and adds it to the state.
 * @deprecated
 */
export default function* categoryCreateSaga({
    payload,
}: PayloadAction<{
    category: Partial<ICategory>;
}>): unknown {
    try {
        const response = yield retry<{ category: ICategory }>(() =>
            APIService.createCategory(payload.category),
        );

        if (response.error || !response.payload) {
            yield put(intakeError(response));
        } else {
            yield put(createCategory({ category: response.payload.category }));
        }
    } catch (error) {
        yield put(intakeError(error));
    }
}
