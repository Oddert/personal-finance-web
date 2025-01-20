import { put } from 'redux-saga/effects';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { IStandardResponse } from '../../types/Request.d';
import type { Category } from '../../types/Category.d';

import APIService from '../../services/APIService';

import { createCategory } from '../slices/categorySlice';

/**
 * Creates a category and adds it to the state.
 */
export default function* categoryCreateSaga({
    payload,
}: PayloadAction<{
    category: Partial<Category>;
}>): any {
    try {
        const response: IStandardResponse<{ category: Category }> =
            yield APIService.createCategory(payload.category);

        if (response.error || !response.payload) {
            console.error(response.error);
        } else {
            yield put(createCategory({ category: response.payload.category }));
        }
    } catch (error) {
        console.error(error);
    }
}
