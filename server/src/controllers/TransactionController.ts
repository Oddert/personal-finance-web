import { Request, Response } from 'express'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { respondBadRequest, respondCreated, respondNotFound, respondOk } from '../utils/responses'

import Transaction from '../models/Transaction'

dayjs.extend(customParseFormat)

export const getTransaction = async (req: Request, res: Response) => {
    try {
        const startDate = typeof req.query?.from === 'string'
            ? dayjs(req.query.from, 'DD/MM/YYYY').valueOf()
            : dayjs(0).valueOf()

        const endDate = typeof req.query?.to === 'string'
            ? dayjs(req.query.to, 'DD/MM/YYYY').valueOf()
            : dayjs(undefined).valueOf()

        if (req.query.includeCategory) {
            const transactions = await Transaction.query()
                .whereBetween('date', [startDate, endDate])
                .withGraphFetched('assignedCategory')
                .orderBy('date', 'DESC')
            return respondOk(req, res, { transactions })
        }

        const transactions = await Transaction.query()
            .whereBetween('date', [startDate, endDate])
            .orderBy('date', 'DESC')
        return respondOk(req, res, { transactions })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const getSingleTransactions = async (req: Request, res: Response) => {
    try {
        const transaction = req.query.includeCategory
            ? await Transaction.query().findById(req.params.id).withGraphFetched('assignedCategory')
            : await Transaction.query().findById(req.params.id)

        if (!transaction) {
            return respondNotFound(req, res, { id: req.params.id })
        }
        return respondOk(req, res, { transaction })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createSingleTransaction = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const body = { ...req.body, created_on: date, updated_on: date }
        
        // TODO: Research why the beforeInsert hooks are not working and replace: 
        if (req.body.assignedCategory) {
            body.assignedCategory.created_on = date
            body.assignedCategory.updated_on = date
            if (req.body.assignedCategory.matchers) {
                body.assignedCategory.matchers = req.body.assignedCategory.matchers.map(
                    (matcher: any) => ({
                        ...matcher,
                        created_on: date,
                        updated_on: date,
                    })
                )
            }
        }

        const transaction = req.body.assignedCategory
            ? await Transaction.query().insertGraphAndFetch(body)
            : await Transaction.query().insertAndFetch(body)
        
        return respondCreated(req, res, { transaction }, 'Transaction created successfully', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const updateSingleTransaction = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const body = {...req.body, updated_on: date }

        const transaction = await Transaction.query().patchAndFetchById(req.params.id, body)

        return respondCreated(req, res, { transaction }, 'Transaction updated successfully', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const deleteSingleTransaction = async (req: Request, res: Response) => {
    try {
        const deleted = await Transaction.query()
            .deleteById(Number(req.params.id))

        return respondOk(req, res, { deleted }, 'Delete operation successful.', 204)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createManyTransactions = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const createdTransactions = []

        for (const transaction of req.body.transactions) {
            const body = { ...transaction, created_on: date, updated_on: date }
            if (typeof transaction.date === 'string') {
                body.date = dayjs(transaction.date, 'DD/MM/YYYY').valueOf()
            }
    
            const createdTransaction = await Transaction.query().insertAndFetch(body)
            createdTransactions.push(createdTransaction)
        }

        return respondCreated(req, res, { createdTransactions }, 'Transactions created successfully')
    } catch(err: any) {
        console.log(err)
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const updateManyTransactions = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const updatedTransactions = []
        
        for (const transaction of req.body.transactions) {
            const body = { ...transaction, created_on: date, updated_on: date }
            if (typeof transaction.date === 'string') {
                body.date = dayjs(transaction.date, 'DD/MM/YYYY').valueOf()
            }
            
            const updatedTransaction = await Transaction.query().patchAndFetchById(transaction.id, body)
            updatedTransactions.push(updatedTransaction)
        }
        
        return respondCreated(req, res, { updatedTransactions }, 'Transactions updated successfully', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}
