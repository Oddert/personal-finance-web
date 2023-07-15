import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../constants/store'

export const getTransactionsState = (state: RootState) => state.transaction

export const getTransactionsResponse = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.response,
)

export const getTransactionsStartDate = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.startDate
)

export const getTransactionsEndDate = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.endDate
)
