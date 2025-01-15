import { Request, Response } from 'express'

import { respondCreated, respondOk, respondServerError } from '../utils/responses'

import Budget from '../models/Budget'
import BudgetRow from '../models/BudgetRow'

export const getBudgets = async (req: Request, res: Response) => {
    try {
        const budgets = await Budget.query().withGraphJoined('budgetRows')
        return respondOk(req, res, { budgets })
    } catch (error: any) {
        return respondServerError(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const getBudgetRows = async (req: Request, res: Response) => {
    try {
        const budgetRows = await BudgetRow.query().withGraphJoined('budget')
        return respondOk(req, res, { budgetRows })
    } catch (error: any) {
        return respondServerError(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const createSingleBudget = async (req: Request, res: Response) => {
    try {
        const now = new Date().toISOString()
        const body = { ...req.body, createdOn: now, updatedOn: now }
        const stagedBudget = await Budget.query().insertAndFetch(body)
        
        for (const row of req.body.budgetRows) {
            const rowWithId = { ...row, budgetId: stagedBudget.id }
            await BudgetRow.query().insertAndFetch(rowWithId)
        }

        if (stagedBudget.id) {
            const budget = await Budget.query().findById(stagedBudget.id).withGraphJoined('budgetRows')    
            return respondCreated(req, res, { budget })
        }

        return respondServerError(req, res, null, 'Something went wrong processing your request', 500)
    } catch (error: any) {
        return respondServerError(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}
