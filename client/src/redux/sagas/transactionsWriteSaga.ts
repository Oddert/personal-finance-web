import { call, put, select } from 'redux-saga/effects'

import routes from '../../services/routes'

import { mapCategoriesToTransactions, orderTransactions } from '../../utils/transactionUtils'

import type { ResponseData } from '../../types/Request'
import type { Transaction } from '../../types/Transaction'

import { CategoryState, requestCategories } from '../slices/categorySlice'
import { writeTransactions } from '../slices/transactionsSlice'

import { getCategoryOrderedDataById, getCategoryQueried } from '../selectors/categorySelectors'

/**
 * Bulk creates transactions and re-loads part of the state.
 */
export default function* transactionsWriteSaga () {
    try {
        const queried: boolean = yield select(getCategoryQueried)
        if (!queried) {
            yield put(requestCategories())
        }
        
        const transactionsResponse: ResponseData<{ transactions: Transaction[] }> =
            yield call(routes.getAllTransactions)

        if (!transactionsResponse?.payload?.transactions) {
            return
        }

        const orderedCategories: CategoryState['orderedData']['byId'] = yield select(getCategoryOrderedDataById)

        const transactions = mapCategoriesToTransactions(
            transactionsResponse?.payload?.transactions,
            orderedCategories,    
        )
        const orderedTransactions = orderTransactions(transactionsResponse?.payload?.transactions)

        yield put(writeTransactions({ transactions, orderedTransactions }))
    } catch(error) {
        console.error(error)
    }
}
