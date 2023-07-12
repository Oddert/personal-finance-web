import { takeEvery } from 'redux-saga/effects'

import { requestTransactions } from '../slices/transactionsSlice'

import transactionsWriteSaga from '../sagas/transactionsWriteSaga'

export default function* rootSaga() {
    yield takeEvery(requestTransactions().type, transactionsWriteSaga)
}
