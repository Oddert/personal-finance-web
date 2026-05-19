import type { ICard } from '../../types/Card.types';
import type { AppDispatch, RootState } from '../constants/store';
import type { TFunction } from 'i18next';

import APIService from '../../services/APIService';
import { cardsLoading, setActiveCard, writeCards } from '../slices/cardSlice';

import { intakeError } from './errorThunks';
import { conditionallyRefreshTransactions } from './transactionThunks';

/**
 * Conditional re-requests the card state from the server.
 *
 * By default will abort a refresh if another refresh has occurred in the last 5 mins.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshCards =
    (t: TFunction, override?: boolean) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const thePast = new Date().getTime() - 300_000;

            if (
                override ||
                !state.card.loaded ||
                (state.card.timestamp && state.card.timestamp <= thePast)
            ) {
                dispatch(cardsLoading());
                const response = await APIService.getAllCards();
                if (!response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                if (response.status === 200) {
                    dispatch(
                        writeCards({
                            cards: response.payload.cards,
                        }),
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };

/**
 * Updates the active card and optionally refreshes transactions.
 * @category Redux
 * @subcategory Thunks
 * @param card The new card to be set as active.
 * @param refreshTransactions If true, transactions will also be refreshed after change.
 */
export const setActiveCardWithTransactions =
    (card: ICard, refreshTransactions?: boolean) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setActiveCard({ card }));
            if (refreshTransactions) {
                dispatch(
                    conditionallyRefreshTransactions(
                        undefined,
                        undefined,
                        true,
                    ),
                );
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
