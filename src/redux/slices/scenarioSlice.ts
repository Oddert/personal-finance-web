import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IScenario } from '../../types/Scenario.types';

export interface IScenarioState {
    scenarios: IScenario[];
    loading: boolean;
    loaded: boolean;
    timestamp: number;
}

const initialState: IScenarioState = {
    scenarios: [],
    loading: false,
    loaded: false,
    timestamp: 0,
};

export const scenarioSlice = createSlice({
    name: 'scenario',
    initialState,
    reducers: {
        addScenario(
            state,
            { payload }: PayloadAction<{ scenario: IScenario }>,
        ) {
            state.scenarios.push(payload.scenario);
            state.loaded = true;
            state.loading = false;
        },
        scenariosLoading(state) {
            state.loaded = false;
            state.loading = true;
        },
        writeScenarios(
            state,
            {
                payload,
            }: PayloadAction<{
                scenarios: IScenario[];
            }>,
        ) {
            state.scenarios = payload.scenarios;
            state.loaded = true;
            state.loading = false;
            state.timestamp = Date.now();
        },
    },
});

export const { addScenario, scenariosLoading, writeScenarios } =
    scenarioSlice.actions;

export default scenarioSlice.reducer;
