import { Router } from 'express'

import Transaction from '../models/Transaction'
// import Category from '../models/Category'

const router = Router()

router.route('/')
    .get((req, res) => res.json('message received'))

router.route('/test')
    .get(async (req, res) => {
        const transactions = await Transaction.query().withGraphFetched('[assignedCategory, assignedCategory.matchers]')
        // const categories = await Category.query().withGraphFetched('transactions')
        // res.json({ transactions, categories })
        res.json({ transactions })
    })

export default router
