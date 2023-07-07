import { Router } from 'express'

import { getMatcherCategory, resetServer } from '../controllers/DebugController'

const router = Router()

router.route('/reset-database')
    .post(resetServer)

router.route('/matcher-category')
    .get(getMatcherCategory)

export default router
