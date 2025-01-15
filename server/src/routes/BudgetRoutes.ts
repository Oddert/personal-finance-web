import { Router } from 'express'

import {
    createSingleBudget,
    getBudgetRows,
    getBudgets,
} from '../controllers/BudgetController'

const router = Router()

router.route('/')
    .get(getBudgets)
    .post(createSingleBudget)

router.route('/rows')
    .get(getBudgetRows)

export default router
