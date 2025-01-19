import { ColumnNameMappers, Model } from 'objection'

import knex from '../db/knex'

Model.knex(knex)

export default class Budget extends Model {
    id?: number
    static created_on: Date | string
    static updated_on: Date | string

    static get tableName() {
        return 'budget_row'
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
            required: [
                'categoryId',
                'label',
                'colour',
                'value',
                'varLowPc',
                'varHighPc',
            ],
            properties: {
                id: { type: 'number' },
                budgetId: { type: 'number' },
                colour: { type: 'string' },
                categoryId: { type: 'number' },
                label: { type: 'string', minLength: 3 },
                value: { type: 'number' },
                varLowPc: { type: 'number' },
                varHighPc: { type: 'number' },
            },
        }
    }

    static get relationMappings() {
        const Budget = __dirname + '/Budget'
        return {
            budget: {
                relation: Model.BelongsToOneRelation,
                modelClass: Budget,
                join: {
                    from: 'budget_row.budget_id',
                    to: 'budget.id',
                }
            }
        }
    }

    static columnNameMappers: ColumnNameMappers = {
        parse(obj) {
            return {
                id: obj.id,
                budgetId: obj.budget_id,
                categoryId: obj.category_id,
                colour: obj.colour,
                label: obj.label,
                value: obj.value,
                varLowPc: obj.var_low_pc,
                varHighPc: obj.var_high_pc,
            }
        },
        format(obj) {
            return {
                id: obj.id,
                budget_id: obj.budgetId,
                category_id: obj.categoryId,
                colour: obj.colour,
                label: obj.label,
                value: obj.value,
                var_low_pc: obj.varLowPc,
                var_high_pc: obj.varHighPc,
            }
        },
    }
}