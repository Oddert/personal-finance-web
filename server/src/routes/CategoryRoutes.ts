import { Router } from 'express'
import { checkSchema } from 'express-validator'

import {
    createManyCategories,
    createSingleCategory,
    deleteSingleCategory,
    getCategories,
    getSingleCategory,
    updateSingleCategory,
} from '../controllers/CategoryController'
import {
    createCategorySchema,
    createManyCategoriesSchema,
    updateCategorySchema,
} from '../schemas/CategorySchema'

const router = Router()

router.route('/')
    .get(getCategories)
    .post(
        checkSchema(createCategorySchema),
        createSingleCategory,
    )

router.route('/:id')
    .get(getSingleCategory)
    .put(
        checkSchema(updateCategorySchema),
        updateSingleCategory,
    )
    .delete(deleteSingleCategory)

router.route('/create-many')
    .post(
        checkSchema(createManyCategoriesSchema),
        createManyCategories,
    )

export default router
