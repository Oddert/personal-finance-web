import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../constants/store';

/**
 * Returns the 'transaction' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsState = (state: RootState) => state.transaction;

/**
 * Returns the full list of Transactions.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsResponse = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.response,
);

/**
 * Gets all Transactions ordered by date and category ID.
 *
 * See also {@link getTransactionsOrderedByDate} and {@link getTransactionsOrderedByCategory}.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsOrdered = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.orderedData,
);

/**
 * Gets all Transactions ordered by year and month, as two nested objects.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsOrderedByDate = createSelector(
    getTransactionsOrdered,
    (orderedData) => orderedData.byDate,
);

/**
 * Gets all Transactions as an object with Transaction.category_id as keys.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsOrderedByCategory = createSelector(
    getTransactionsOrdered,
    (orderedData) => orderedData.byCategory,
);

/**
 * The start date of the currently loaded transactions.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsStartDate = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.startDate,
);

/**
 * The start date of the currently loaded transactions.
 * @category Redux
 * @subcategory Selectors
 */
export const getTransactionsEndDate = createSelector(
    getTransactionsState,
    (transactionsState) => transactionsState.endDate,
);
