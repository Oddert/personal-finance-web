import APIService from '../../services/APIService';
import { IBudget } from '../../types/Budget.types';

import { AppDispatch, RootState } from '../constants/store';

import { budgetLoading, writeBudgets } from '../slices/budgetSlice';

/**
 * Conditional re-requests the budget state from the server.
 *
 * By default will abort a refresh if another refresh has occurred in the last 5 mins.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshBudgets = (override?: boolean) =>
	async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			console.log(new Date())
			const state = getState();
			const thePast = new Date().getTime() - 300_000;

			if (
				override ||
				!state.budget.loaded ||
				(state.budget.timestamp &&
					state.budget.timestamp <= thePast)
			) {
				dispatch(budgetLoading());
				const response: any = await APIService.getAllBudgets();
				if (response?.status === 200) {
					dispatch(writeBudgets({
						budgets: (response?.payload.budgets || []) as IBudget[]
					}));
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
