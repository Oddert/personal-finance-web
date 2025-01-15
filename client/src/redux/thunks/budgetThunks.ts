import { IBudget } from '../../types/Budget.types';

import { AppDispatch, RootState } from '../constants/store';

import { budgetLoading, tempResponse, writeBudgets } from '../slices/budgetSlice';

/**
 * Conditional re-requests the budget state from the server.
 *
 * By default will abort a refresh if another refresh has occured in the last 5 mins.
 * @param override If true, a refresh will be foreced.
 */
export const refreshBudgets = (override?: boolean) =>
	async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			const state = getState();
			const thePast = new Date().getTime() - 300_000;

			if (
				override ||
				!state.budget.loaded ||
				(state.budget.timestamp &&
					state.budget.timestamp <= thePast)
			) {
				dispatch(budgetLoading());
				const budgets: IBudget[] = tempResponse;
				dispatch(writeBudgets({ budgets }));
			}
		} catch (error) {
			console.error(error);
		}
	}
