import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../constants/store';

/**
 * Returns the 'card' section of the redux state.
 * @category Redux
 * @subcategory Selectors
 */
const getCardSate = (state: RootState) => state.card;

/**
 * Returns the full list of budgets.
 * @category Redux
 * @subcategory Selectors
 */
export const getCardResponse = createSelector(
    getCardSate,
    (cardState) => cardState.response,
);

/**
 * True if the budgets are loading or a card request is pending.
 * @category Redux
 * @subcategory Selectors
 */
export const getCardLoading = createSelector(
    getCardSate,
    (cardState) => cardState.loading,
);

/**
 * True if the budgets have been loaded and are ready for use.
 * @category Redux
 * @subcategory Selectors
 */
export const getCardLoaded = createSelector(
    getCardSate,
    (cardState) => cardState.loaded,
);

/**
 * Returns the currently active card.
 * @category Redux
 * @subcategory Selectors
 */
export const getActiveCard = createSelector(
    getCardSate,
    (cardState) => cardState.activeCard,
);

/**
 * Returns the ID of the currently active card.
 * @category Redux
 * @subcategory Selectors
 */
export const getActiveCardId = createSelector(
    getActiveCard,
    (activeCard) => activeCard?.id || null,
);
