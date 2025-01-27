import APIService from '../../services/APIService';

import { ICard } from '../../types/Card.types';

import { AppDispatch, RootState } from '../constants/store';

import { cardsLoading, writeCards } from '../slices/cardSlice';

import { intakeError } from './errorThunks';

/**
 * Conditional re-requests the card state from the server.
 *
 * By default will abort a refresh if another refresh has occurred in the last 5 mins.
 * @category Redux
 * @subcategory Thunks
 * @param override If true, a refresh will be forced.
 */
export const refreshCards =
    (override?: boolean) =>
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
                if (!response || !response.payload) {
                    throw new Error('No response received from the server.');
                }
                if (response?.status === 200) {
                    dispatch(
                        writeCards({
                            cards: (response?.payload.cards || []) as ICard[],
                        }),
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(intakeError(error));
        }
    };
