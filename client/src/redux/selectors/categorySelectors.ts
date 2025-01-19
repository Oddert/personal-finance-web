import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../constants/store'

/**
 * Returns the 'category' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
const getCategoryState = (state: RootState) => state.category

/**
 * Returns the full list of categories.
 * @category Redux
 * @subcategory Selectors
 */
export const getCategoryResponse = createSelector(
    getCategoryState,
    category => category.response,
)

/**
 * Gets all categories ordered by ID and Label.
 *
 * See also {@link getCategoryOrderedDataById} and {@link getCategoryOrderedDataByLabel}.
 * @category Redux
 * @subcategory Selectors
 */
export const getCategoryOrderedData = createSelector(
    getCategoryState,
    category => category.orderedData,
)

/**
 * Gets all categories as an object with Category.id as keys.
 * @category Redux
 * @subcategory Selectors
 */
export const getCategoryOrderedDataById = createSelector(
	getCategoryOrderedData,
    orderedData => orderedData.byId,
)

/**
 * Gets all categories as an object with Category.label as keys.
 * @category Redux
 * @subcategory Selectors
 */
export const getCategoryOrderedDataByLabel = createSelector(
    getCategoryOrderedData,
    orderedData => orderedData.byLabel,
)

/**
 * True if the categories have been loaded and are ready for use.
 * @category Redux
 * @subcategory Selectors
 */
export const getCategoryQueried = createSelector(
    getCategoryState,
    category => category.queried
)
