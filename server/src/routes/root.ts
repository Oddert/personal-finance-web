import { Router } from 'express'

import Transaction from '../models/transaction'

const router = Router()

router.route('/')
    .get((req, res) => res.json('message received'))

router.route('/test')
    .get(async (req, res) => {
        const transactions = await Transaction.query()
        res.json({ transactions })
    })

export default router
