import type { PayloadAction } from '@reduxjs/toolkit'
import { put } from 'redux-saga/effects'

import routes from '../../services/routes'

import type { Category } from '../../types/Category'
import type { ResponseData } from '../../types/Request'

import { updateSingleCategory } from '../slices/categorySlice'

/**
 * Updates a category.
 */
export default function* categoryUpdateSingleSaga (
    { payload }: PayloadAction<{
        category: Partial<Category>,
    }>
) {
    try {
        const response: ResponseData<{ category: Category }> =
            yield routes.updateCategory(payload.category)

        if (!response.payload?.category || response.error) {
            throw new Error(response.error || 'Issue encountered updating category.')
        }
        
        yield put(updateSingleCategory({ category: response.payload.category }))
    } catch (error) {
        console.error(error)
    }
}