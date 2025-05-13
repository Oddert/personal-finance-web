import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBudget } from '../../types/Budget.types';

/**
 * Redux state key for 'budget'
 * @category Redux
 * @subcategory Budget Slice
 */
export interface IBudgetState {
    loading: boolean;
    loaded: boolean;
    timestamp: number;
    response: IBudget[];
    activeBudget: IBudget | null;
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
        addBudget: (state, { payload }: PayloadAction<{ budget: IBudget }>) => {
            state.loaded = true;
            state.loading = false;
            state.response.push(payload.budget);
        },
        budgetLoading: (state) => {
            state.loaded = false;
            state.loading = true;
        },
        deleteBudget: (
            state,
            { payload }: PayloadAction<{ budgetId: string }>,
        ) => {
            state.loaded = true;
            state.loading = false;
            state.response = state.response.filter(
                (budget) => budget.id !== payload.budgetId,
            );
            if (payload.budgetId === state.activeBudget?.id) {
                state.activeBudget = null;
            }
        },
        setActiveBudget: (
            state,
            { payload }: PayloadAction<{ budget: IBudget }>,
        ) => {
            state.activeBudget = payload.budget;
        },
        updateBudget: (
            state,
            { payload }: PayloadAction<{ budget: IBudget }>,
        ) => {
            state.response = state.response.map((budget) =>
                budget.id === payload.budget.id ? payload.budget : budget,
            );
            state.loaded = true;
            state.loading = false;
        },
        writeBudgets: (
            state,
            { payload }: PayloadAction<{ budgets: IBudget[] }>,
        ) => {
            state.loaded = true;
            state.loading = false;
            state.timestamp = Date.now();
            state.response = payload.budgets;
            if (payload.budgets.length) {
                const foundActive = payload.budgets.find(
                    (budget) => budget.isDefault,
                );
                state.activeBudget = foundActive || payload.budgets[0];
            }
        },
    },
});

export const {
    addBudget,
    budgetLoading,
    deleteBudget,
    setActiveBudget,
    writeBudgets,
} = budgetSlice.actions;

export default budgetSlice.reducer;
