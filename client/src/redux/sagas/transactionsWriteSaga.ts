import { call, put } from 'redux-saga/effects'

import routes from '../../services/routes'

import { orderTransactions } from '../../utils/transactionUtils'

import { ResponseData } from '../../types/Request'
import { Transaction } from '../../types/Transaction'

import { writeTransactions } from '../slices/transactionsSlice'

export default function* transactionsWriteSaga () {
    try {        
        const transactions: ResponseData<{ transactions: Transaction[]}> =
            yield call(routes.getAllTransactions)

        console.log(transactions)
        if (!transactions?.payload?.transactions) {
            return
        }

        const orderedTransactions = orderTransactions(transactions?.payload?.transactions)
        console.log(orderedTransactions)
        yield put(writeTransactions(orderedTransactions))
    } catch(error) {
        console.error(error)
    }
}
