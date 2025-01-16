import { Router } from 'express'

import {
    createSingleBudget,
    deleteSingleBudget,
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
    .delete(deleteSingleBudget)

router.route('/preferences/:id')
    .put(setActiveBudget)

router.route('/rows')
    .get(getBudgetRows)

export default router
