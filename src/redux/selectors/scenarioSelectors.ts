import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../constants/store';

/**
 * Returns the 'scenario' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
export const getScenarioState = (state: RootState) => state.scenario;

/**
 * Retrieves all scenarios loaded in state.
 * @category Redux
 * @subcategory Selectors
 */
export const getScenarios = createSelector(
    getScenarioState,
    (scenarioState) => scenarioState.scenarios,
);

/**
 * True if the scenarios are loading or a budget request is pending.
 * @category Redux
 * @subcategory Selectors
 */
export const getScenariosLoading = createSelector(
    getScenarioState,
    (scenarioState) => scenarioState.loading,
);

/**
 * True if the scenarios have been loaded and are ready for use.
 * @category Redux
 * @subcategory Selectors
 */
export const getScenariosLoaded = createSelector(
    getScenarioState,
    (scenarioState) => scenarioState.loaded,
);
