import { takeEvery } from 'redux-saga/effects'

import {
    initCreateCategory,
    initCreateSingleMatcher,
    initDeleteSingleCategory,
    initDeleteSingleMatcher,
    initUpdateSingleCategory,
    requestCategories
} from '../slices/categorySlice'
import { requestTransactions } from '../slices/transactionsSlice'

import categoryCreateSaga from '../sagas/categoryCreateSaga'
import categoryDeleteSingleSaga from '../sagas/categoryDeleteSingleSaga'
import categoryUpdateSingleSaga from '../sagas/categoryUpdateSingleSaga'
import categoryWriteSaga from '../sagas/categoryWriteSaga'
import matcherCreateSingleSaga from '../sagas/matcherCreateSingleSaga'
import matcherDeleteSingleSaga from '../sagas/matcherDeleteSingleSaga'
import transactionsWriteSaga from '../sagas/transactionsWriteSaga'

export default function* rootSaga() {
    yield takeEvery(requestTransactions({}).type, transactionsWriteSaga)
    yield takeEvery(requestCategories().type, categoryWriteSaga)
    yield takeEvery(initCreateCategory({ category: {} }).type, categoryCreateSaga)
    yield takeEvery(initUpdateSingleCategory({ category: {} }).type, categoryUpdateSingleSaga)
    yield takeEvery(initDeleteSingleCategory({ categoryId: 0 }).type, categoryDeleteSingleSaga)
    yield takeEvery(initCreateSingleMatcher({ categoryId: 0, matcher: {} }).type, matcherCreateSingleSaga)
    yield takeEvery(initDeleteSingleMatcher({ categoryId: 0, matcherId: 0 }).type, matcherDeleteSingleSaga)
}
