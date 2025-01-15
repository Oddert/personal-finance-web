import { createSlice } from '@reduxjs/toolkit';

import { IBudget } from '../../types/Budget.types';

export const tempResponse: IBudget[] = [
	{
		id: 1,
		name: 'Standard',
		shortDescription: 'My typical day-to-day budget.',
		longDescription: 'My typical day-to-day budget.',
		createdOn: new Date().toString(),
		updatedOn: new Date().toString(),
		budget: {
			1: {
				id: 1,
				categoryId: 1,
				label: 'food',
				value: 200,
				varLowPc: 10,
				varHighPc: 10,
			},
			2: {
				id: 2,
				categoryId: 2,
				label: 'support',
				value: 35,
				varLowPc: 10,
				varHighPc: 10,
			},
			3: {
				id: 3,
				categoryId: 3,
				label: 'travel',
				value: 80,
				varLowPc: 10,
				varHighPc: 10,
			},
			4: {
				id: 4,
				categoryId: 4,
				label: 'health',
				value: 50,
				varLowPc: 10,
				varHighPc: 10,
			},
			5: {
				id: 5,
				categoryId: 5,
				label: 'subscriptions',
				value: 10,
				varLowPc: 10,
				varHighPc: 10,
			},
			6: {
				id: 6,
				categoryId: 6,
				label: 'bike',
				value: 70,
				varLowPc: 10,
				varHighPc: 10,
			},
			7: {
				id: 7,
				categoryId: 7,
				label: 'income',
				value: 0,
				varLowPc: 10,
				varHighPc: 10,
			},
			8: {
				id: 8,
				categoryId: 8,
				label: 'work',
				value: 20,
				varLowPc: 10,
				varHighPc: 10,
			},
			9: {
				id: 9,
				categoryId: 9,
				label: 'phone',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			10: {
				id: 10,
				categoryId: 10,
				label: 'dentist',
				value: 21,
				varLowPc: 10,
				varHighPc: 10,
			},
			11: {
				id: 11,
				categoryId: 11,
				label: 'therapy',
				value: 280,
				varLowPc: 10,
				varHighPc: 10,
			},
			12: {
				id: 12,
				categoryId: 12,
				label: 'home',
				value: 100,
				varLowPc: 10,
				varHighPc: 10,
			},
			13: {
				id: 13,
				categoryId: 13,
				label: 'investment',
				value: 0,
				varLowPc: 10,
				varHighPc: 10,
			},
			14: {
				id: 14,
				categoryId: 14,
				label: 'rent',
				value: 1350,
				varLowPc: 10,
				varHighPc: 10,
			},
			15: {
				id: 15,
				categoryId: 15,
				label: 'gifts',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			16: {
				id: 16,
				categoryId: 16,
				label: 'garden',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			17: {
				id: 17,
				categoryId: 17,
				label: 'clothes',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			20: {
				id: 20,
				categoryId: 20,
				label: 'utilities',
				value: 350,
				varLowPc: 0,
				varHighPc: 0,
			},
		},
	},
	{
		id: 2,
		name: 'Just food',
		shortDescription: "Who's idea was it to have a budget with just food?",
		longDescription: 'Nostrud sunt velit ullamco mollit aliquip laboris irure et officia aliquip.',
		createdOn: new Date().toString(),
		updatedOn: new Date().toString(),
		budget: {
			1: {
				id: 1,
				categoryId: 1,
				label: 'food',
				value: 200,
				varLowPc: 10,
				varHighPc: 10,
			},
		},
	},
]

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
			state.activeBudget = payload.budgets[0] || null;
			state.response = payload.budgets;
		},
	},
});

export const {
	budgetLoading,
	setActiveBudget,
	writeBudgets,
} = budgetSlice.actions;

export default budgetSlice.reducer;