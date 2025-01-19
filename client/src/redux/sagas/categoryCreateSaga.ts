import { put } from 'redux-saga/effects'

import type { PayloadAction } from '@reduxjs/toolkit'

import type { ResponseData } from '../../types/Request'
import type { Category } from '../../types/Category'

import routes from '../../services/routes'

import { createCategory } from '../slices/categorySlice'

/**
 * Creates a category and adds it to the state.
 */
export default function* categoryCreateSaga(
    { payload }: PayloadAction<{
        category: Partial<Category>
    }>
) {
    try {
        const response: ResponseData<{ category: Category }> =
            yield routes.createCategory(payload.category)
        
        if (response.error || !response.payload) {
            console.error(response.error)
        } else {
            yield put(createCategory({ category: response.payload.category }))
        }
    } catch (error) {
        console.error(error)
    }
}
