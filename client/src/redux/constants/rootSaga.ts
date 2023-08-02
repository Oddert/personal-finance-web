import { takeEvery } from 'redux-saga/effects'

import {
    initCreateSingleMatcher,
    initDeleteSingleMatcher,
    requestCategories
} from '../slices/categorySlice'
import { requestTransactions } from '../slices/transactionsSlice'

import categoryWriteSaga from '../sagas/categoryWriteSaga'
import matcherCreateSingleSaga from '../sagas/matcherCreateSingleSaga'
import matcherDeleteSingleSaga from '../sagas/matcherDeleteSingleSaga'
import transactionsWriteSaga from '../sagas/transactionsWriteSaga'

export default function* rootSaga() {
    yield takeEvery(requestTransactions({}).type, transactionsWriteSaga)
    yield takeEvery(requestCategories().type, categoryWriteSaga)
    yield takeEvery(initCreateSingleMatcher({ categoryId: 0, matcher: {} }).type, matcherCreateSingleSaga)
    yield takeEvery(initDeleteSingleMatcher({ categoryId: 0, matcherId: 0 }).type, matcherDeleteSingleSaga)
}
