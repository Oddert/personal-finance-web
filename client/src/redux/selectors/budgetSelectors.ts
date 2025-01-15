import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../constants/store'

const getBudgetSate = (state: RootState) => state.budget;

export const getBudgetResponse = createSelector(
	getBudgetSate,
	(budgetState) => budgetState.response,
);

export const getBudgetLoading = createSelector(
	getBudgetSate,
	(budgetState) => budgetState.loading,
);

export const getBudgetLoaded = createSelector(
	getBudgetSate,
	(budgetState) => budgetState.loaded,
);

export const getActiveBudget = createSelector(
	getBudgetSate,
	(budgetState) => budgetState.activeBudget,
);
