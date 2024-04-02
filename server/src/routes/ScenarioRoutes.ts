import { Router } from 'express'

import {
    createManyScenarios,
    createSingleScenario,
    deleteManyScenarios,
    deleteSingleScenario,
    getScenarios,
    getSingleScenario,
    updateSingleScenario,
} from '../controllers/ScenarioController'

const router = Router()

router.route('/')
    .get(getScenarios)
    .post(createSingleScenario)

router.route('/:id')
    .get(getSingleScenario)
    .put(updateSingleScenario)
    .delete(deleteSingleScenario)

router.route('/create-many')
    .post(createManyScenarios)

router.route('/delete-many')
    .post(deleteManyScenarios)

export default router
