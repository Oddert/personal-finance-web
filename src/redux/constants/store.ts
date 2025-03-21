import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from '../slices/authSlice';
import budgetReducer from '../slices/budgetSlice';
import cardReducer from '../slices/cardSlice';
import errorReducer from '../slices/errorSlice';
import categoryReducer from '../slices/categorySlice';
import profileReducer from '../slices/profileSlice';
import transactionReducer from '../slices/transactionsSlice';

import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: authReducer,
        budget: budgetReducer,
        card: cardReducer,
        category: categoryReducer,
        error: errorReducer,
        profile: profileReducer,
        transaction: transactionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
