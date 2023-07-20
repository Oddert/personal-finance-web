import { call, put } from 'redux-saga/effects'

import { Category } from '../../types/Category'
import { ResponseData } from '../../types/Request'

import routes from '../../services/routes'

import { sortCategories } from '../../utils/categoryUtils'
import { writeCategories } from '../slices/categorySlice'

export default function* categoryWriteSaga() {
    try {
        const categoriesResponse: ResponseData<{ categories: Category[] }> =
            yield call(routes.getAllCategoriesWithMatchers)

        const categories = categoriesResponse?.payload?.categories || []
        
        const orderedData = sortCategories(categories)

        yield put(writeCategories({ categories, orderedData }))
    } catch (error) {
        console.error(error)
    }
}