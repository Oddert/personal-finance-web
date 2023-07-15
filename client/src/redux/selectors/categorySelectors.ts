import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../constants/store'

const getCategoryState = (state: RootState) => state.category

export const getCategoryResponse = createSelector(
    getCategoryState,
    category => category.response,
)

export const getCategoryOrderedData = createSelector(
    getCategoryState,
    category => category.orderedData,
)

export const getCategoryOrderedDataById = createSelector(
    getCategoryOrderedData,
    orderedData => orderedData.byId,
)

export const getCategoryOrderedDataByLabel = createSelector(
    getCategoryOrderedData,
    orderedData => orderedData.byLabel,
)

export const getCategoryQueried = createSelector(
    getCategoryState,
    category => category.queried
)
