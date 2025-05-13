import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ICard } from '../../types/Card.types';

/**
 * Redux state key for 'card'
 * @category Redux
 * @subcategory Budget Slice
 */
export interface ICardState {
    loading: boolean;
    loaded: boolean;
    timestamp: number;
    response: ICard[];
    activeCard: ICard | null;
}

const initialState: ICardState = {
    loading: false,
    loaded: false,
    timestamp: 0,
    response: [],
    activeCard: null,
};

export const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        addCard: (state, { payload }: PayloadAction<{ card: ICard }>) => {
            state.loaded = true;
            state.loading = false;
            state.response.push(payload.card);
        },
        cardsLoading: (state) => {
            state.loaded = false;
            state.loading = true;
        },
        deleteCard: (state, { payload }: PayloadAction<{ cardId: string }>) => {
            state.loaded = true;
            state.loading = false;
            state.response = state.response.filter(
                (card) => card.id !== payload.cardId,
            );
            if (payload.cardId === state.activeCard?.id) {
                state.activeCard = null;
            }
        },
        setActiveCard: (state, { payload }: PayloadAction<{ card: ICard }>) => {
            state.activeCard = payload.card;
        },
        updateCard: (state, { payload }: PayloadAction<{ card: ICard }>) => {
            state.response = state.response.map((card) =>
                card.id === payload.card.id ? payload.card : card,
            );
            state.loaded = true;
            state.loading = false;
        },
        writeCards: (state, { payload }: PayloadAction<{ cards: ICard[] }>) => {
            state.loaded = true;
            state.loading = false;
            state.timestamp = Date.now();
            state.response = payload.cards;
            if (payload.cards.length) {
                const foundActive = payload.cards.find(
                    (card) => card.isDefault,
                );
                state.activeCard = foundActive || payload.cards[0];
            }
        },
    },
});

export const {
    addCard,
    cardsLoading,
    deleteCard,
    setActiveCard,
    updateCard,
    writeCards,
} = cardSlice.actions;

export default cardSlice.reducer;
