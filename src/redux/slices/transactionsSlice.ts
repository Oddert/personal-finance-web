import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Transaction } from '../../types/Transaction.d';

dayjs.extend(localizedFormat);

/**
 * Redux state key for 'transaction'
 * @category Redux
 * @subcategory Transaction Slice
 */
export interface TransactionState {
    endDate: number;
    endDateReadable: string | null;
    loading: boolean;
    loaded: boolean;
    orderedData: {
        byDate: {
            [year: string]: {
                [month: number]: Transaction[];
            };
        };
        byCategory: {
            [category: number]: Transaction[];
        };
    };
    startDate: number;
    startDateReadable: string | null;
    refreshed: string | null;
    response: Transaction[];
}

const initialState: TransactionState = {
    endDate: dayjs().valueOf(),
    endDateReadable: null,
    loaded: false,
    loading: false,
    orderedData: {
        byDate: {},
        byCategory: {},
    },
    startDate: dayjs().subtract(3, 'months').valueOf(),
    startDateReadable: null,
    refreshed: null,
    response: [],
};

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        requestTransactions: (
            state,
            {
                payload,
            }: PayloadAction<{
                startDate?: string;
                endDate?: string;
            } | null>,
        ) => {
            state.loaded = false;
            state.loading = true;
            if (payload?.startDate) {
                state.startDate = new Date(payload.startDate).getTime();
                state.startDateReadable = payload.startDate;
            }
            if (payload?.endDate) {
                state.endDate = new Date(payload.endDate).getTime();
                state.endDateReadable = payload.endDate;
            }
        },
        setStartDate: (
            state,
            { payload }: PayloadAction<{ startDate: string }>,
        ) => {
            state.startDate = new Date(payload.startDate).getTime();
            state.startDateReadable = payload.startDate;
        },
        setEndDate: (
            state,
            { payload }: PayloadAction<{ endDate: string }>,
        ) => {
            state.endDate = new Date(payload.endDate).getTime();
            state.endDateReadable = payload.endDate;
        },
        writeTransactions: (
            state,
            {
                payload,
            }: PayloadAction<{
                transactions: TransactionState['response'];
                orderedTransactions: TransactionState['orderedData'];
                timestamp: string;
            }>,
        ) => {
            state.refreshed = payload.timestamp;
            state.loaded = true;
            state.loading = false;
            state.orderedData = payload.orderedTransactions;
            state.response = payload.transactions;
        },
    },
});

export const {
    requestTransactions,
    setEndDate,
    setStartDate,
    writeTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
