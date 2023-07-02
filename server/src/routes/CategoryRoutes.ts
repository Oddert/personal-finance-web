import { Router } from 'express'

import {
    createManyCategories,
    createSingleCategory,
    deleteSingleCategory,
    getCategories,
    getSingleCategory,
    updateSingleCategory,
} from '../controllers/CategoryController'

const router = Router()

router.route('/')
    .get(getCategories)
    .post(createSingleCategory)

router.route('/:id')
    .get(getSingleCategory)
    .put(updateSingleCategory)
    .delete(deleteSingleCategory)

router.route('/create-many')
    .post(createManyCategories)

export default router
