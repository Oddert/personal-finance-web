import { Request, Response } from 'express'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { respondBadRequest, respondCreated, respondOk } from '../utils/responses'

import Scenario from '../models/Scenario'

dayjs.extend(customParseFormat)

export const getScenarios = async (req: Request, res: Response) => {
    try {
        const startDate = typeof req.query?.from === 'string'
            ? dayjs(req.query.from, 'DD/MM/YYYY').valueOf()
            : dayjs(0).valueOf()

        const endDate = typeof req.query?.to === 'string'
            ? dayjs(req.query.to, 'DD/MM/YYYY').valueOf()
            : dayjs(undefined).valueOf()

        if (req.query?.from || req.query?.to) {
            const scenarios = await Scenario.query()
                .whereBetween('start_date', [startDate, endDate])
                .withGraphFetched('transactors.[schedulers]')
                .orderBy('title', 'DESC')
    
            return respondOk(req, res, { scenarios })
        }
        
        const scenarios = await Scenario.query()
            .withGraphFetched('transactors.[schedulers]')
            .orderBy('title', 'DESC')
            
        return respondOk(req, res, { scenarios })
    } catch (error: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const createSingleScenario = async (req: Request, res: Response) => {
    try {
        const body = { ...req.body }

        const scenario = req.body.transactors
            ? await Scenario.query().insertGraphAndFetch(body)
            : await Scenario.query().insertAndFetch(body)

        return respondCreated(req, res, { scenario })
    } catch (error: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const getSingleScenario = async (req: Request, res: Response) => {
    try {
        const scenario = await Scenario.query()
            .findById(req.params.id)
            .withGraphFetched('transactors.[schedulers]')

        return respondOk(req, res, { scenario })
    } catch (error: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const updateSingleScenario = async (req: Request, res: Response) => {
    try {
        const now = new Date().toISOString()
        const body = { ...req.body, updated_on: now }
        const scenario = await Scenario.query().patchAndFetchById(req.params.id, body)

        return respondCreated(req, res, { scenario }, 'Scenario updated successfully', 201)
    } catch (error: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, error.message)
    }
}

export const deleteSingleScenario = async (req: Request, res: Response) => {
    try {
        const deleted = await Scenario.query()
            .deleteById(Number(req.params.id))

        return respondOk(req, res, { deleted }, 'Delete operation successful.', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const createManyScenarios = async (req: Request, res: Response) => {
    try {
        const date = new Date().toISOString()
        const createdScenarios = []

        for (const transaction of req.body.transactions) {
            const body = { ...transaction, created_on: date, updated_on: date }
    
            const createdTransaction = await Scenario.query().insertGraphAndFetch(body)
            createdScenarios.push(createdTransaction)
        }

        return respondCreated(req, res, { createdScenarios }, 'Transactions created successfully')
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}

export const deleteManyScenarios = async (req: Request, res: Response) => {
    try {
        const deletedScenarios = []

        for (const scenarioId of req.body.scenarios) {
            const deleted = await Scenario.query()
                .deleteById(Number(scenarioId))

            deletedScenarios.push(deleted)
        }
        
        return respondOk(req, res, { deletedScenarios }, 'Delete operation successful.', 201)
    } catch(err: any) {
        return respondBadRequest(req, res, null, 'Something went wrong processing your request', 500, err.message)
    }
}
