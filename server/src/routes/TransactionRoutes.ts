import { Router } from 'express'
import { checkSchema } from 'express-validator'

import {
    createSingleTransaction,
    getTransactions,
    getSingleTransactions,
    updateSingleTransaction,
    deleteSingleTransaction,
    createManyTransactions,
} from '../controllers/TransactionController'

import {
    createManyTransactionSchema,
    createTransactionSchema,
    updateTransactionSchema
} from '../schemas/TransactionSchema'

const router = Router()

router.route('/')
    .get(getTransactions)
    .post(
        checkSchema(createTransactionSchema),
        createSingleTransaction,
    )

router.route('/:id')
    .get(getSingleTransactions)
    .put(
        checkSchema(updateTransactionSchema),
        updateSingleTransaction,
    )
    .delete(deleteSingleTransaction)

router.route('/create-many')
    .post(
        checkSchema(createManyTransactionSchema),
        createManyTransactions,
    )

export default router