import { Request, Response } from 'express'

import { respondBadRequest, respondCreated, respondNotFound, respondOk } from '../utils/responses'

import Category from '../models/Category'
import Matcher from '../models/Matcher'
import Transaction from '../models/Transaction'

export const getCategories = async (req: Request, res: Response) => {
    try {
        if (req.query.includeMatchers) {
            const categories = await Category.query()
                .orderBy('label', 'ASC')
                .withGraphFetched('matchers')

            return respondOk(req, res, { categories })
        }
        const categories = await Category.query()
        return respondOk(req, res, { categories })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
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
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createSingleCategory = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const body = { ...req.body, created_on: date, updated_on: date }

        const category = req.body.matchers
            ? await Category.query().insertGraphAndFetch(body)
            : await Category.query().insertAndFetch(body)

        return respondCreated(req, res, { category })
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const updateSingleCategory = async (req: Request, res: Response) => {
    try {
        const body = { ...req.body, updated_on: new Date().toISOString() }
        
        if (req.body.matchers) {
            const category = await Category.query().findById(req.params.id)

            if (!category) {
                return respondBadRequest(
                    req,
                    res,
                    null,
                    'Something went wrong processing your request',
                    500,
                    'Category of ID "" does not exist.'
                )
            }

            const createHashmap = (acc: {[key: string]: any}, matcher: any) => {
                if (matcher?.id) {
                    acc[matcher.id] = matcher
                }
                return acc
            }

            const existingMatchers = await category.$relatedQuery<Matcher>('matchers')
            const requestedMatchersLookup: object = req.body.matchers.reduce(createHashmap, {})

            // Search over the existing Matchers
            //      if found in the requested lookup object; do nothing
            //      if not found; un-relate (do not delete)
            existingMatchers.forEach(matcher => {
                if (matcher.id && !requestedMatchersLookup.hasOwnProperty(matcher.id)) {
                    category.$relatedQuery('matchers').unrelate().where('id', matcher.id)
                }
            })

            // Search over the requested Matchers
            //      if it exists; relate to category
            //      if not found; create and relate
            for (const matcher of req.body.matchers) {
                if (matcher?.id) {
                    const foundMatcher = await Matcher.query().findById(matcher.id)
                    if (foundMatcher) {
                        category.$relatedQuery('matchers').relate(matcher.id)
                    } else {
                        const createdMatcher = await Matcher.query().insertAndFetch(matcher)
                        category.$relatedQuery('matchers').relate(createdMatcher)
                    }
                }
            }
        }

        const category = req.params.includeMatchers
            ? await Category.query().patchAndFetchById(req.params.id, body).withGraphFetched('matchers')
            : await Category.query().patchAndFetchById(req.params.id, body)

        return respondOk(req, res, { category }, 'Category updated successfully', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const deleteSingleCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.query().findById(Number(req.params.id))
        await category?.$relatedQuery('matchers').unrelate()
        // BUG: 'category' must be an integer?? -> relation un-mapping seems to work differently with HasMany vs ManyToMany
        // await category?.$relatedQuery('transactions').unrelate()
        await Transaction.query().where('category_id', Number(req.params.id)).unrelate()
    
        const deleted = await Category.query()
            .deleteById(Number(req.params.id))

        return respondOk(req, res, { deleted }, 'Delete operation successful.', 204)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createManyCategories = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const createdMatchers: Category[] = []

        for (const category of req.body.categories) {
            const body = { ...category, created_on: date, updated_on: date }
            const createdCategory = await Category.query().insertAndFetch(body)
            createdMatchers.push(createdCategory)
        }

        return respondCreated(req, res, { createdMatchers }, 'Matchers created successfully', 204)
    } catch(err: any) {
        return respondBadRequest(
            req,
            res,
            null,
            'Something went wrong processing your request',
            500,
            err.message,
        )
    }
}
