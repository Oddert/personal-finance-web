import { call, put } from 'redux-saga/effects';

import type { Category } from '../../types/Category.d';
import type { IStandardResponse } from '../../types/Request.d';

import APIService from '../../services/APIService';

import { sortCategories } from '../../utils/categoryUtils';

import { writeCategories } from '../slices/categorySlice';

/**
 * Loads all categories.
 */
export default function* categoryWriteSaga() {
    try {
        const categoriesResponse: IStandardResponse<{
            categories: Category[];
        }> = yield call(APIService.getAllCategoriesWithMatchers);

        const categories = categoriesResponse?.payload?.categories || [];

        const orderedData = sortCategories(categories);

        yield put(writeCategories({ categories, orderedData }));
    } catch (error) {
        console.error(error);
    }
}
