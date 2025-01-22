import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import budgetReducer from '../slices/budgetSlice';
import errorReducer from '../slices/errorSlice';
import categoryReducer from '../slices/categorySlice';
import transactionReducer from '../slices/transactionsSlice';

import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        budget: budgetReducer,
        category: categoryReducer,
        error: errorReducer,
        transaction: transactionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
