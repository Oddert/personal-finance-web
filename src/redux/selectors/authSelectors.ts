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

/**
 * Returns true if the user-entered details are incorrect.
 * @category Redux
 * @subcategory Selectors
 */
export const getIncorrectAuthDetails = createSelector(
    getAuthState,
    (authState) => authState.incorrectDetails,
);

/**
 * Returns true if a request to the refresh token endpoint is pending.
 * @category Redux
 * @subcategory Selectors
 */
export const getRefreshTokenPending = createSelector(
    getAuthState,
    (authState) => authState.refreshRequestInProgress,
);

/**
 * Returns the logged in user's first name.
 * @category Redux
 * @subcategory Selectors
 */
export const getUserFirstName = createSelector(
    getAuthState,
    (authState) => authState.user?.fistName,
);
