import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import categoryReducer from '../slices/categorySlice'
import budgetReducer from '../slices/budgetSlice';
import transactionReducer from '../slices/transactionsSlice'

import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
		category: categoryReducer,
		budget: budgetReducer,
        transaction: transactionReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch