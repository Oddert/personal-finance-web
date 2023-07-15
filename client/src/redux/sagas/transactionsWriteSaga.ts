import { call, put, select } from 'redux-saga/effects'

import routes from '../../services/routes'

import { mapCategoriesToTransactions, orderTransactions } from '../../utils/transactionUtils'

import { Category } from '../../types/Category'
import { ResponseData } from '../../types/Request'
import { Transaction } from '../../types/Transaction'

import { CategoryState, requestCategories } from '../slices/categorySlice'
import { writeTransactions } from '../slices/transactionsSlice'

import { getCategoryOrderedDataById, getCategoryQueried, getCategoryResponse } from '../selectors/categorySelectors'

export default function* transactionsWriteSaga () {
    try {
        const queried: boolean = yield select(getCategoryQueried)
        if (!queried) {
            // if not, fetch and write
            yield put(requestCategories())
        }
        
        const categories: Category[] = yield select(getCategoryResponse)
        // map categories to transactions
        console.log(categories)

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
