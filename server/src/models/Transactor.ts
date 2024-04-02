import { Model } from 'objection'

export default class Transactor extends Model {
    id?: number
    created_on: Date | string
    updated_on: Date | string
    static created_on: Date | string
    static updated_on: Date | string
    description: string
    is_addition: boolean
    value: number
    scenario_id: number

    static get tableName() {
        return 'transactor'
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
                description: { type: 'string' },
                value: { type: 'number' },
                scenario_id: { type: 'number' },
            }
        }
    }

    static get relationMappings() {
        const Scenario = __dirname + '/Scenario'
        const Scheduler = __dirname + '/Scheduler'
        return {
            assignedScenario: {
                relation: Model.BelongsToOneRelation,
                modelClass: Scenario,
                join: {
                    from: 'transactor.scenario_id',
                    to: 'scenario.id',
                }
            },
            schedulers: {
                relation: Model.HasManyRelation,
                modelClass: Scheduler,
                join: {
                    from: 'transactor.id',
                    to: 'scheduler.transactor_id',
                },
            },
        }
    }
}