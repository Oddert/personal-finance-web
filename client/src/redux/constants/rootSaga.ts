import { takeEvery } from 'redux-saga/effects'

import { requestCategories } from '../slices/categorySlice'
import { requestTransactions } from '../slices/transactionsSlice'

import categoryWriteSaga from '../sagas/categoryWriteSaga'
import transactionsWriteSaga from '../sagas/transactionsWriteSaga'

export default function* rootSaga() {
    yield takeEvery(requestTransactions({}).type, transactionsWriteSaga)
    yield takeEvery(requestCategories().type, categoryWriteSaga)
}
