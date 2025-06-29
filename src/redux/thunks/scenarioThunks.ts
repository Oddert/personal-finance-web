import APIService from '../../services/APIService';

import { AppDispatch, RootState } from '../constants/store';

import { scenariosLoading, writeScenarios } from '../slices/scenarioSlice';

import { intakeError } from './errorThunks';

/**
 * Conditional re-requests the scenario state from the server.
 *
 * By default will abort a refresh if another refresh has occurred in the last 5 mins.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshScenarios =
    (override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const thePast = new Date().getTime() - 300_000;

            if (
                override ||
                !state.scenario.loaded ||
                (state.scenario.timestamp &&
                    state.scenario.timestamp <= thePast)
            ) {
                dispatch(scenariosLoading());
                const response = await APIService.getAllScenarios();
                if (!response || !response.payload) {
                    throw new Error('No response received from the server.');
                }
                if (response?.status === 200) {
                    dispatch(
                        writeScenarios({
                            scenarios: response.payload.scenarios,
                        }),
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
