import type { PayloadAction } from '@reduxjs/toolkit'
import { put } from 'redux-saga/effects'

import routes from '../../services/routes'

import type { Category } from '../../types/Category'
import type { Matcher } from '../../types/Matcher'
import type { ResponseData } from '../../types/Request'

import { deleteSingleMatcher } from '../slices/categorySlice'

export default function* matcherDeleteSingleSaga(
    { payload }: PayloadAction<{
        matcherId: Matcher['id'],
        categoryId: Category['id'],
    }>
) {
    try {
        const response: ResponseData<{ error?: string }> =
            yield routes.deleteSingleMatcher(payload.matcherId)

        if (response.error) {
            console.error(response?.payload?.error)
        } else {
            yield put(deleteSingleMatcher(payload))
        }
    } catch (error) {
        console.error(error)
    }
}
