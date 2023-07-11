import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TransactionState {
    endDate: number|null
    endDateReadable: string|null
    loaded: boolean
    orderedData: object
    startDate: number|null
    startDateReadable: string|null
    refreshed: string|null
    response: any[]
}

const initialState: TransactionState = {
    endDate: null,
    endDateReadable: null,
    loaded: false,
    orderedData: {},
    startDate: null,
    startDateReadable: null,
    refreshed: null,
    response: [],
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        writeTransactions: (state, action: PayloadAction<string>) => {
            state.refreshed = action.payload
        }
    }
})

export const { writeTransactions } = transactionSlice.actions

export default transactionSlice.reducer
