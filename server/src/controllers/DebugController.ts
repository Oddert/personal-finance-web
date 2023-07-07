import { Request, Response } from 'express'

import { respondServerError, respondOk } from '../utils/responses'

import CategoryMatcher from '../models/CategoryMatcher'

export const resetServer = async (req: Request, res: Response) => {
    try {
        // const result = knex('category_matcher')
        return respondOk(req, res)
    } catch(err: any) {
        return respondServerError(req, res, null, null, 500, err.message)
    }
}

export const getMatcherCategory = async (req: Request, res: Response) => {
    try {
        const result = await CategoryMatcher.query()
        return respondOk(req, res, { result })
    } catch(err: any) {
        return respondServerError(req, res, null, null, 500, err.message)
    }
}
