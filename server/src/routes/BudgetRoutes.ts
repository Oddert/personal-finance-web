import { Router } from 'express'

import {
    createSingleBudget,
    getBudgetRows,
    getBudgets,
    getSingalBudget,
} from '../controllers/BudgetController'

const router = Router()

router.route('/')
    .get(getBudgets)
    .post(createSingleBudget)

router.route('/:id')
    .get(getSingalBudget)

router.route('/rows')
    .get(getBudgetRows)

export default router
