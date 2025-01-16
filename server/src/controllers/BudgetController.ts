import { Request, Response } from 'express'

import { respondCreated, respondNotFound, respondOk, respondServerError } from '../utils/responses'

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

export const getSingleBudget = async (req: Request, res: Response) => {
    try {
        const budget = await Budget.query().findById(req.params.id).withGraphJoined('budgetRows')
        return respondOk(req, res, { budget })
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
        const body = { ...req.body, isDefault: Boolean(req.body.isDefault), createdOn: now, updatedOn: now }
        delete body.id
        console.log({ body })
        const stagedBudget = await Budget.query().insertAndFetch(body)
        
        for (const row of req.body.budgetRows) {
            const rowWithId = { ...row, budgetId: stagedBudget.id }
            delete rowWithId.id
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

export const updateSingleBudget = async (req: Request, res: Response) => {
    try {
        const stagedBudget = await Budget.query().findById(req.params.id).withGraphFetched('budgetRows')

        if (!stagedBudget) {
            return respondNotFound(req, res, null, `No budget with id "${req.params.id}" found.`)
        }

        const body = {
            name: req.body?.name || stagedBudget.name,
            shortDescription: req.body?.shortDescription || stagedBudget.shortDescription,
            longDescription: req.body?.longDescription || stagedBudget.longDescription,
            isDefault: Boolean(req.body?.isDefault || false),
            createdOn: req.body?.createdOn || stagedBudget.createdOn,
            updatedOn: req.body?.updatedOn || stagedBudget.updatedOn,
        }

        const budget = await Budget.query().patchAndFetchById(req.params.id, body)
        return respondCreated(req, res, { budget }, 'Budget updated successfully')
    } catch (error: any) {
        return respondServerError(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const deleteSingleBudget = async (req: Request, res: Response) => {
    try {
        await Budget.query().deleteById(req.params.id)

        return respondCreated(req, res, null, 'Budget deleted successfully')
    } catch (error: any) {
        return respondServerError(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const setActiveBudget = async (req: Request, res: Response) => {
    try {
        const actives = await Budget.query().where('is_default', true)

        for (const activeBudget of actives) {
            activeBudget.$query().patch({ isDefault: false })
        }

        await Budget.query().patchAndFetchById(req.params.id, { isDefault: true })

        return respondCreated(req, res, null, 'Budget set as default')
    } catch (error: any) {
        return respondServerError(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}
