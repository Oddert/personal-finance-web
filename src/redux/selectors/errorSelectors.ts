import { RootState } from '../constants/store';

/**
 * Returns the 'error' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
export const getErrorState = (state: RootState) => state.error;
