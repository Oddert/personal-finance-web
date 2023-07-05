import { Router } from 'express'

import { getTransactions } from '../controllers/TransactionController'

const router = Router()

router.route('/')
    .get(getTransactions)

export default router