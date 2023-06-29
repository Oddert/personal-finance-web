import { Model } from 'objection'
import knex from '../db/knex'

Model.knex(knex)

export default class Category extends Model {
    id?: 'integer'
    description?: string
    colour?: string
    static created_on: Date | string
    static updated_on: Date | string

    static get tableName() {
        return 'category'
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
                id: { type: 'integer', readonly: true },
                description: { type: ['string', 'null'] },
                colour: { type: 'string', minLength: 3 },
                created_on: { type: 'date' },
                updated_on: { type: 'date' },                
            }
        }
    }

    static get relationMappings() {
		const Transaction = __dirname + '/Transaction' // require('./User')
		const Matcher = __dirname + '/Matcher' // require('./User')
        return {
            transactions: {
                relation: Model.HasManyRelation,
                modelClass: Transaction,
                join: {
                    from: 'category.id',
                    to: 'transaction.category',
                }
            },
            matchers: {
                relation: Model.ManyToManyRelation,
                modelClass: Matcher,
                join: {
                    from: 'category.id',
                    through: {
                        from: 'category_matcher.category_id',
                        to: 'category_matcher.matcher_id',
                    },
                    to: 'matcher.id',
                }
            },
        }
    }
}