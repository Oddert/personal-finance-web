/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type PayloadAction } from '@reduxjs/toolkit';
import { put } from 'redux-saga/effects';

import type { ICategory } from '../../types/Category.d';

import APIService from '../../services/APIService';
import { retry } from '../../utils/requestUtils';
import { updateSingleCategory } from '../slices/categorySlice';

/**
 * Updates a category.
 * @deprecated
 */
export default function* categoryUpdateSingleSaga({
    payload,
}: PayloadAction<{
    category: Partial<ICategory>;
}>): unknown {
    try {
        const response = yield retry<{ category: ICategory }>(() =>
            APIService.updateCategory(payload.category),
        );

        if (!response.payload?.category || response.error) {
            throw new Error(
                response.error ?? 'Issue encountered updating category.',
            );
        }

        yield put(
            updateSingleCategory({ category: response.payload.category }),
        );
    } catch (error) {
        console.error(error);
    }
}
