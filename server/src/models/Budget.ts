import { ColumnNameMappers, Model } from 'objection'

import knex from '../db/knex'

Model.knex(knex)

export default class Budget extends Model {
    id?: number
    name: string
    shortDescription: string
    longDescription: string
    isDefault: boolean
    createdOn: string
    updatedOn: string
    static created_on: Date | string
    static updated_on: Date | string

    static get tableName() {
        return 'budget'
    }

    static beforeInsert() {
        const now = new Date().toISOString()
        this.created_on = now
        this.updated_on = now
    }

    static $beforeInsert() {
        const now = new Date().toISOString()
        this.created_on = now
        this.updated_on = now
    }

    static $afterFind() {
        this.created_on = this.created_on ? new Date(this.created_on).toISOString() : ''
        this.updated_on = this.updated_on ? new Date(this.updated_on).toISOString() : ''
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'shortDescription', 'longDescription', 'createdOn', 'updatedOn'],
            properties: {
                id: { type: 'number' },
                name: { type: 'string', minLength: 3 },
                shortDescription: { type: 'string' },
                longDescription: { type: 'string' },
                isDefault: { type: 'boolean' },
                createdOn: { type: 'string' },
                updatedOn: { type: 'string' },
            },
        }
    }

    static get relationMappings() {
        const BudgetRow = __dirname + '/BudgetRow'
        return {
            budgetRows: {
                relation: Model.HasManyRelation,
                modelClass: BudgetRow,
                join: {
                    from: 'budget.id',
                    to: 'budget_row.budget_id',
                }
            }
        }
    }

    static columnNameMappers: ColumnNameMappers = {
        parse(obj) {
            return {
                id: obj.id,
                name: obj.name,
                shortDescription: obj.short_desc,
                longDescription: obj.long_desc,
                isDefault: obj.is_default,
                createdOn: obj.created_on,
                updatedOn: obj.updated_on,
            }
        },
        format(obj) {
            return {
                id: obj.id,
                name: obj.name,
                short_desc: obj.shortDescription,
                long_desc: obj.longDescription,
                is_default: obj.isDefault,
                created_on: obj.createdOn,
                updated_on: obj.updatedOn,
            }
        },
    }
}