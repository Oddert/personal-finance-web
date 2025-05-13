import type { PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import APIService from '../../services/APIService';

import type { ICategory } from '../../types/Category.d';
import type { IStandardResponse } from '../../types/Request.d';

import { updateSingleCategory } from '../slices/categorySlice';

/**
 * Updates a category.
 */
export default function* categoryUpdateSingleSaga({
    payload,
}: PayloadAction<{
    category: Partial<ICategory>;
}>): any {
    try {
        const response: IStandardResponse<{ category: ICategory }> =
            yield APIService.updateCategory(payload.category);

        if (!response.payload?.category || response.error) {
            throw new Error(
                response.error || 'Issue encountered updating category.',
            );
        }

        yield put(
            updateSingleCategory({ category: response.payload.category }),
        );
    } catch (error) {
        console.error(error);
    }
}
