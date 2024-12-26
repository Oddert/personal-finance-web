import { Model } from 'objection'

export default class Scenario extends Model {
    id?: number
    start_date?: Date | string
    end_date?: Date | string
    static start_date: Date | string
    static end_date: Date | string
    created_on: Date | string
    updated_on: Date | string
    static created_on: Date | string
    static updated_on: Date | string
    title: string
    description: string
    start_ballance?: number
    transactors?: any[]

    static get tableName() {
        return 'scenario'
    }

    $beforeInsert() {
        const now = new Date().toISOString()
        this.created_on = now
        this.updated_on = now
        this.start_date = this.start_date ? new Date(this.start_date).toISOString() : ''
        this.end_date = this.end_date ? new Date(this.end_date).toISOString() : ''
    }

    $afterFind() {
        this.created_on = this.created_on ? new Date(this.created_on).toISOString() : ''
        this.updated_on = this.updated_on ? new Date(this.updated_on).toISOString() : ''
        this.start_date = this.start_date ? new Date(this.start_date).toISOString() : ''
        this.end_date = this.end_date ? new Date(this.end_date).toISOString() : ''
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'number' },
                created_on: { type: 'string' },
                updated_on: { type: 'string' },
                start_date: { type: ['string', 'null'] },
                end_date: { type: ['string', 'null'] },
                title: { type: 'string' },
                description: { type: 'string' },
                start_ballance: { type: ['number', 'null'] },
            },
        }
    }

    static get relationMappings() {
        const Transactor = __dirname + '/Transactor'
        return {
            transactors: {
                relation: Model.HasManyRelation,
                modelClass: Transactor,
                join: {
                    from: 'scenario.id',
                    to: 'transactor.scenario_id',
                },
            }
        }
    }
}