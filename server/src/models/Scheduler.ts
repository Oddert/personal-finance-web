import { Model } from 'objection'

export default class Scheduler extends Model {
    id?: number
    created_on: Date | string
    updated_on: Date | string
    static created_on: Date | string
    static updated_on: Date | string
    scheduler_code: string
    step?: number
    start_date?: Date | string
    day?: number
    nth_day?: number
    transactor_id: number


    static get tableName() {
        return 'scheduler'
    }

    static beforeInsert() {
        const now = new Date().toISOString()
        this.created_on = now
        this.updated_on = now
    }

    static afterFind() {
        this.created_on = this.created_on ? new Date(this.created_on).toISOString() : ''
        this.updated_on = this.updated_on ? new Date(this.updated_on).toISOString() : ''
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'number' },
                created_on: { type: 'string' },
                updated_on: { type: 'string' },
                start_date: { type: ['string', 'null'] },
                scheduler_code: { type: 'string' },
                step: { type: ['number', 'null'] },
                day: { type: ['number', 'null'] },
                nth_day: { type: ['number', 'null'] },
                transactor_id: { type: ['number', 'null'] },
            }
        }
    }

    static get relationMappings() {
        const Transactor = __dirname + '/Transactor'
        return {
            transactor: {
                relation: Model.BelongsToOneRelation,
                modelClass: Transactor,
                join: {
                    from: 'scheduler.transactor_id',
                    to: 'transactor.id',
                },
            },
        }
    }
}