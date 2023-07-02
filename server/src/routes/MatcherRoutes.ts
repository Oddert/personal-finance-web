import { Router } from 'express'
import { checkSchema } from 'express-validator'

import {
    createManyMatchers,
    createSingleMatcher,
    deleteSingleMatcher,
    getMatchers,
    getSingleMatcher,
    updateSingleMatcher
} from '../controllers/MatcherController'

import {
    createManyMatchersSchema,
    createMatcherSchema,
    updateMatcherSchema,
} from '../schemas/MatcherSchemas'

const router = Router()

router.route('/')
    .get(getMatchers)
    .post(
        checkSchema(createMatcherSchema),
        createSingleMatcher,
    )

router.route('/:id')
    .get(getSingleMatcher)
    .put(
        checkSchema(updateMatcherSchema),
        updateSingleMatcher,
    )
    .delete(deleteSingleMatcher)

router.route('/create-many')
    .post(
        checkSchema(createManyMatchersSchema),
        createManyMatchers,
    )

export default router