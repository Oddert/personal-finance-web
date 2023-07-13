import { call, put } from 'redux-saga/effects'

import routes from '../../services/routes'

import { orderTransactions } from '../../utils/transactionUtils'

import { ResponseData } from '../../types/Request'
import { Transaction } from '../../types/Transaction'

import { writeTransactions } from '../slices/transactionsSlice'

export default function* transactionsWriteSaga () {
    try {
        // check if categories fetched
        // if not, fetch and write
        // map categories to transactions
        const transactionsResponse: ResponseData<{ transactions: Transaction[]}> =
            yield call(routes.getAllTransactions)

        if (!transactionsResponse?.payload?.transactions) {
            return
        }

        const orderedTransactions = orderTransactions(transactionsResponse?.payload?.transactions)
        const transactions = transactionsResponse?.payload?.transactions

        yield put(writeTransactions({ transactions, orderedTransactions }))
    } catch(error) {
        console.error(error)
    }
}
