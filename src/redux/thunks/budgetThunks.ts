import type { AppDispatch, RootState } from '../constants/store';
import type { TFunction } from 'i18next';

import APIService from '../../services/APIService';
import { budgetLoading, writeBudgets } from '../slices/budgetSlice';

import { intakeError } from './errorThunks';

/**
 * Conditional re-requests the budget state from the server.
 *
 * By default will abort a refresh if another refresh has occurred in the last 5 mins.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshBudgets =
    (t: TFunction, override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const thePast = new Date().getTime() - 300_000;

            if (
                override ||
                !state.budget.loaded ||
                (state.budget.timestamp && state.budget.timestamp <= thePast)
            ) {
                dispatch(budgetLoading());
                const response = await APIService.getAllBudgets();
                if (!response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                if (response.status === 200) {
                    dispatch(
                        writeBudgets({
                            budgets: response.payload.budgets,
                        }),
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
