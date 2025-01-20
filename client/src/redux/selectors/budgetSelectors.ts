import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../constants/store';

/**
 * Returns the 'budget' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
const getBudgetSate = (state: RootState) => state.budget;

/**
 * Returns the full list of budgets.
 * @category Redux
 * @subcategory Selectors
 */
export const getBudgetResponse = createSelector(
    getBudgetSate,
    (budgetState) => budgetState.response,
);

/**
 * True if the budgets are loading or a budget request is pending.
 * @category Redux
 * @subcategory Selectors
 */
export const getBudgetLoading = createSelector(
    getBudgetSate,
    (budgetState) => budgetState.loading,
);

/**
 * True if the budgets have been loaded and are ready for use.
 * @category Redux
 * @subcategory Selectors
 */
export const getBudgetLoaded = createSelector(
    getBudgetSate,
    (budgetState) => budgetState.loaded,
);

/**
 * Returns the currently active budget.
 * @category Redux
 * @subcategory Selectors
 */
export const getActiveBudget = createSelector(
    getBudgetSate,
    (budgetState) => budgetState.activeBudget,
);

/**
 * Returns the ID of the currently active budget.
 * @category Redux
 * @subcategory Selectors
 */
export const getActiveBudgetId = createSelector(
    getActiveBudget,
    (budgetState) => budgetState?.id || null,
);
