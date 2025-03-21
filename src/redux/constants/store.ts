import { combineReducers, configureStore } from '@reduxjs/toolkit';
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

const rootReducer = combineReducers({
    auth: authReducer,
    budget: budgetReducer,
    card: cardReducer,
    category: categoryReducer,
    error: errorReducer,
    profile: profileReducer,
    transaction: transactionReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        preloadedState,
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(sagaMiddleware),
    });
};

const store = setupStore();

sagaMiddleware.run(rootSaga);

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
