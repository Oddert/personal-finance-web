import { Model } from 'objection'
import knex from '../db/knex'

Model.knex(knex)

export default class Transaction extends Model {
    id?: 'integer'
    date?: Date
    transaction_type?: string
    description?: string
    debit?: number
    credit?: number
    ballance?: number
    static created_on: Date | string
    static updated_on: Date | string
    category?: 'integer'

    static get tableName() {
        return 'transaction'
    }

    static beforeInsert() {
        const now = new Date()
        this.created_on = now
        this.updated_on = now
    }

    static afterFind() {
        this.created_on = new Date(this.created_on).toLocaleString('en-GB')
        this.updated_on = new Date(this.updated_on).toLocaleString('en-GB')
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                date: { type: 'date' },
                transaction_type: { type: 'string', minLength: 1, maxLength: 5 },
                description: { type: ['string', 'null'] },
                debit: { type: 'number' },
                credit: { type: 'number' },
                ballance: { type: 'number' },
                created_on: { type: 'date' },
                updated_on: { type: 'date' },
                category: { type: 'integer' },
            }
        }
    }

    static get relationMappings() {
		const Category = __dirname + '/Category' // require('./User')
        return {
            assignedCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'transaction.category',
                    to: 'category.id',
                }
            }
        }
    }
}