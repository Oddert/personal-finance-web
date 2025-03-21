import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../constants/store';

/**
 * Returns the 'auth' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
const getAuthState = (state: RootState) => state.auth;

/**
 * Returns the auth status of the user as a boolean.
 * @category Redux
 * @subcategory Selectors
 */
export const getIsAuthenticated = createSelector(
    getAuthState,
    (authState) => authState.authenticated,
);
