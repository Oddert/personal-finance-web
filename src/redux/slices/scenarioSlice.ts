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
        deleteScenario(
            state,
            { payload }: PayloadAction<{ scenarioId: IScenario['id'] }>,
        ) {
            state.scenarios = state.scenarios.filter(
                (scenario) => scenario.id !== payload.scenarioId,
            );
        },
        scenariosLoading(state) {
            state.loaded = false;
            state.loading = true;
        },
        updateScenario(
            state,
            { payload }: PayloadAction<{ scenario: IScenario }>,
        ) {
            state.scenarios = state.scenarios.map((scenario) => {
                if (scenario.id === payload.scenario.id) {
                    return payload.scenario;
                }
                return scenario;
            });
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

export const {
    addScenario,
    deleteScenario,
    scenariosLoading,
    updateScenario,
    writeScenarios,
} = scenarioSlice.actions;

export default scenarioSlice.reducer;
