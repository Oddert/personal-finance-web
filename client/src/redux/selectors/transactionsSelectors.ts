import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../constants/store'

export const getTransactionsState = (state: RootState) => state.transaction

export const getTransactionsResponse = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.response,
)

export const getTransactionsOrdered = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.orderedData,
)

export const getTransactionsOrderedByDate = createSelector(
    getTransactionsOrdered,
    (orderedData) => orderedData.byDate,
)

export const getTransactionsStartDate = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.startDate
)

export const getTransactionsEndDate = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.endDate
)
