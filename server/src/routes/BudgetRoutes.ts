import { Router } from 'express'

import {
    createSingleBudget,
    getBudgetRows,
    getBudgets,
    getSingleBudget,
    setActiveBudget,
    updateSingleBudget,
} from '../controllers/BudgetController'

const router = Router()

router.route('/')
    .get(getBudgets)
    .post(createSingleBudget)

router.route('/:id')
    .get(getSingleBudget)
    .put(updateSingleBudget)

router.route('/preferences/:id')
    .put(setActiveBudget)

router.route('/rows')
    .get(getBudgetRows)

export default router
