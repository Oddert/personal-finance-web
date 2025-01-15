import { createSlice } from '@reduxjs/toolkit';

import { IBudget } from '../../types/Budget.types';

export interface IBudgetState {
	loading: boolean
	loaded: boolean
	timestamp: number
	response: IBudget[]
	activeBudget: IBudget | null
}

const initialState: IBudgetState = {
    loading: false,
    loaded: false,
	timestamp: 0,
    response: [],
	activeBudget: null,
};

export const budgetSlice = createSlice({
	name: 'budget',
	initialState,
	reducers: {
		budgetLoading: (state) => {
			state.loaded = false;
			state.loading = true;
		},
		setActiveBudget: (state, { payload }: { payload: { budget: IBudget } }) => {
			state.activeBudget = payload.budget;
		},
		writeBudgets: (state, { payload }: { payload: { budgets: IBudget[] } }) => {
			state.loaded = true;
			state.loading = false;
			state.timestamp = Date.now();
			state.response = payload.budgets;
			if (payload.budgets.length) {
				const foundActive = payload.budgets.find((budget) => budget.isDefault);
				state.activeBudget = foundActive ||  payload.budgets[0] 
			}
		},
	},
});

export const {
	budgetLoading,
	setActiveBudget,
	writeBudgets,
} = budgetSlice.actions;

export default budgetSlice.reducer;