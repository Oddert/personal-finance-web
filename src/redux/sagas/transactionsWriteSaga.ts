import { call, put, select } from 'redux-saga/effects';

import APIService from '../../services/APIService';

import {
    mapCategoriesToTransactions,
    orderTransactions,
} from '../../utils/transactionUtils';

import type { IStandardResponse } from '../../types/Request.d';
import type { Transaction } from '../../types/Transaction.d';

import { CategoryState, requestCategories } from '../slices/categorySlice';
import { writeTransactions } from '../slices/transactionsSlice';

import { getActiveCardId } from '../selectors/cardSelectors';
import {
    getCategoryOrderedDataById,
    getCategoryQueried,
} from '../selectors/categorySelectors';
import {
    getTransactionsEndDate,
    getTransactionsStartDate,
} from '../selectors/transactionsSelectors';
import { getActiveLanguageCode } from '../selectors/profileSelectors';

/**
 * Bulk creates transactions and re-loads part of the state.
 */
export default function* transactionsWriteSaga() {
    try {
        const queried: boolean = yield select(getCategoryQueried);
        if (!queried) {
            yield put(requestCategories());
        }

        const startDate: number = yield select(getTransactionsStartDate);
        const endDate: number = yield select(getTransactionsEndDate);
        const activeCardId: number | null = yield select(getActiveCardId);
        const language: string = yield select(getActiveLanguageCode);

        const transactionsResponse: IStandardResponse<{
            transactions: Transaction[];
        }> = yield call(
            APIService.getAllTransactionsWithinRange,
            startDate,
            endDate,
            activeCardId,
        );

        if (!transactionsResponse?.payload?.transactions) {
            return;
        }

        const orderedCategories: CategoryState['orderedData']['byId'] =
            yield select(getCategoryOrderedDataById);

        const transactions = mapCategoriesToTransactions(
            transactionsResponse?.payload?.transactions,
            orderedCategories,
        );
        const orderedTransactions = orderTransactions(
            transactionsResponse?.payload?.transactions,
        );
        const timestamp = new Date().toLocaleString(language);

        yield put(
            writeTransactions({ transactions, orderedTransactions, timestamp }),
        );
    } catch (error) {
        console.error(error);
    }
}
