import {Request, Response} from 'express'

import { respondBadRequest, respondCreated, respondNotFound, respondOk } from '../utils/responses'

import Category from '../models/Category'

export const getCategories = async (req: Request, res: Response) => {
    try {
        if (req.query.includeMatchers) {
            const categories = await Category.query().withGraphFetched('matchers')
            return respondOk(req, res, { categories })
        }
        const categories = await Category.query()
        return respondOk(req, res, { categories })
    } catch(err) {
        console.log('oops', err)
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err)
    }
}

export const getSingleCategory = async (req: Request, res: Response) => {
    try {
        const category = req.query.includeMatchers
            ? await Category.query().findById(req.params.id).withGraphFetched('matchers')
            : await Category.query().findById(req.params.id)

        if (!category) {
            return respondNotFound(req, res, { id: req.params.id })
        }
        return respondOk(req, res, { category })
    } catch(err) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err)
    }
}

export const createSingleCategory = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const body = { ...req.body, created_on: date, updated_on: date }
        const category = await Category.query().insert(body)
        return respondCreated(req, res, { category })
    } catch(err) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err)
    }
}

export const updateSingleCategory = async (req: Request, res: Response) => {
    try {
        const body = { ...req.body, updated_on: new Date().toISOString() }
        const category = await Category.query()
            .patchAndFetchById(req.params.id, body)
        return respondOk(req, res, { category })
    } catch(err) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err)
    }
}

export const deleteSingleCategory = async (req: Request, res: Response) => {
    try {
        const deleted = await Category.query()
            .deleteById(req.params.id)
        return respondOk(req, res, { deleted }, 'Delete operation successful.', 204)
    } catch(err) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err)
    }
}

export const createManyCategories = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const createdMatchers = []
        for (const category of req.body.payload.categories) {
            const body = { ...category, created_on: date, updated_on: date }
            const createdMatcher = await Category.query().insert(body)
            createdMatchers.push(createdMatcher)
        }
        return respondCreated(req, res, { createdMatchers }, 'Matchers created successfully', 204)
    } catch(err) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err)
    }
}