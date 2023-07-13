import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { LOCALE } from '../../constants/appConstants'

import { Transaction } from '../../types/Transaction'

export interface TransactionState {
    endDate: number|null
    endDateReadable: string|null
    loaded: boolean
    orderedData: {
        byDate: {
            [year: string]: {
                [month: number]: Transaction[]
            }
        }
        byCategory: {
            [category: number]: Transaction[]
        }
    }
    startDate: number|null
    startDateReadable: string|null
    refreshed: string|null
    response: Transaction[]
}

const initialState: TransactionState = {
    endDate: null,
    endDateReadable: null,
    loaded: false,
    orderedData: {
        byDate: {},
        byCategory: {},
    },
    startDate: null,
    startDateReadable: null,
    refreshed: null,
    response: [],
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        requestTransactions: (state) => {
            state.loaded = false
        },
        writeTransactions: (state, action: PayloadAction<{
            transactions: TransactionState['response'],
            orderedTransactions: TransactionState['orderedData']
        }>) => {
            state.refreshed = new Date().toLocaleString(LOCALE)
            state.orderedData = action.payload.orderedTransactions
            state.response = action.payload.transactions
        },
    }
})

export const {
    requestTransactions,
    writeTransactions,
} = transactionSlice.actions

export default transactionSlice.reducer
