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
        requestTransactions: (state, action: PayloadAction<{
            startDate?: string
            endDate?: string
        }|null>) => {
            state.loaded = false
            if (action?.payload?.startDate) {
                state.startDate = new Date(action.payload.startDate).getTime()
                state.startDateReadable = action.payload.startDate
            }
            if (action?.payload?.endDate) {
                state.endDate = new Date(action.payload.endDate).getTime()
                state.endDateReadable = action.payload.endDate
            }
        },
        setStartDate: (state, action: PayloadAction<{ startDate: string }>) => {
            state.startDate = new Date(action.payload.startDate).getTime()
            state.startDateReadable = action.payload.startDate
        },
        setEndDate: (state, action: PayloadAction<{ endDate: string }>) => {
            state.endDate = new Date(action.payload.endDate).getTime()
            state.endDateReadable = action.payload.endDate
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
    setEndDate,
    setStartDate,
    writeTransactions,
} = transactionSlice.actions

export default transactionSlice.reducer
