import { put } from 'redux-saga/effects';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Category } from '../../types/Category';
import type { ResponseData } from '../../types/Request';

import routes from '../../services/routes';

import { deleteSingleCategory } from '../slices/categorySlice';

export default function* categoryDeleteSingleSaga(
    { payload }: PayloadAction<{
        categoryId: Category['id']
    }>
) {
    try {
        const response: ResponseData<{ error?: string }> =
            yield routes.deleteSingleMatcher(payload.categoryId)
        
        if (response.error) {
            console.error(response?.payload?.error)
        }  else {
            yield put(deleteSingleCategory(payload))
        }
    } catch (error) {
        console.error(error)
    }
}
