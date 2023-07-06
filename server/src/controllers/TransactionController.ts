import { Request, Response } from 'express'

import { respondBadRequest, respondCreated, respondNotFound, respondOk } from '../utils/responses'

import Transaction from '../models/Transaction'

export const getTransactions = async (req: Request, res: Response) => {
    try {
        if (req.query.includeCategory) {
            const transactions = await Transaction.query().withGraphFetched('assignedCategory')
            return respondOk(req, res, { transactions })
        }
        const transactions = await Transaction.query()
        return respondOk(req, res, { transactions })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const getSingleTransactions = async (req: Request, res: Response) => {
    try {
        console.log(req.params.includeCategory)
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

        const transaction = req.body.matchers
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
            .deleteById(req.params.id)

        return respondOk(req, res, { deleted }, 'Delete operation successful.', 204)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createManyTransactions = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const body = { ...req.body, created_on: date, updated_on: date }

        const transaction = await Transaction.query().insertAndFetch(body)

        return respondCreated(req, res, { transaction }, 'Matchers created successfully', 204)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}