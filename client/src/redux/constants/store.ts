import { configureStore } from '@reduxjs/toolkit'

import transactionRouter from '../slices/transactionsSlice'

const store = configureStore({
    reducer: {
        transaction: transactionRouter,
    },
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch