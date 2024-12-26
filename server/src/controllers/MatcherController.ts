import {Request, Response} from 'express'

import { respondBadRequest, respondCreated, respondNotFound, respondOk } from '../utils/responses'

import Matcher from '../models/Matcher'
import Category from '../models/Category'

export const getMatchers = async (req: Request, res: Response) => {
    try {
        const matchers = await Matcher.query()
        return respondOk(req, res, { matchers })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const getSingleMatcher = async (req: Request, res: Response) => {
    try {
        const matcher = await Matcher.query().findById(req.params.id)
        if (!matcher) {
            return respondNotFound(req, res, { id: req.params.id })
        }
        return respondOk(req, res, { matcher })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createSingleMatcher = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const body = { ...req.body, created_on: date, updated_on: date }
        delete body?.categoryId
        const matcher = await Matcher.query().insertAndFetch(body)
        if (req.body?.categoryId) {
            await Category.relatedQuery('matchers').for(req.body.categoryId).relate(matcher)
        }
        return respondCreated(req, res, { matcher })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const updateSingleMatcher = async (req: Request, res: Response) => {
    try {
        const body = { ...req.body, updated_on: new Date().toISOString() }
        const matcher = await Matcher.query()
            .patchAndFetchById(req.params.id, body)
        matcher.created_on = new Date(matcher.created_on).toISOString()
        return respondOk(req, res, { matcher }, 'Matcher updated successfully', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const deleteSingleMatcher = async (req: Request, res: Response) => {
    try {
        await Matcher.relatedQuery('categories').for(req.params.id).unrelate()
        const deleted = await Matcher.query()
            .deleteById(req.params.id)
        return respondOk(req, res, { deleted }, 'Delete operation successful.', 204)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createManyMatchers = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const createdMatchers = []

        for (const matcher of req.body.matchers) {
            const body = { ...matcher, created_on: date, updated_on: date }
            const createdMatcher = await Matcher.query().insertAndFetch(body)
            createdMatchers.push(createdMatcher)
        }

        return respondCreated(req, res, { createdMatchers }, 'Matchers created successfully', 204)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}