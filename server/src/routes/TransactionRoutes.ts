import { Router } from 'express'
import { checkSchema } from 'express-validator'

import {
    createSingleTransaction,
    getTransaction,
    getSingleTransactions,
    updateSingleTransaction,
    deleteSingleTransaction,
    createManyTransactions,
    updateManyTransactions,
} from '../controllers/TransactionController'

import {
    createManyTransactionSchema,
    createTransactionSchema,
    updateTransactionSchema
} from '../schemas/TransactionSchema'

const router = Router()

router.route('/')
    .get(getTransaction)
    .post(
        checkSchema(createTransactionSchema),
        createSingleTransaction,
    )
    
router.route('/create-many')
    .post(
        checkSchema(createManyTransactionSchema),
        createManyTransactions,
    )

router.route('/update-many')
    .put(
        checkSchema(createManyTransactionSchema),
        updateManyTransactions,
    )

router.route('/:id')
    .get(getSingleTransactions)
    .put(
        checkSchema(updateTransactionSchema),
        updateSingleTransaction,
    )
    .delete(deleteSingleTransaction)

export default router