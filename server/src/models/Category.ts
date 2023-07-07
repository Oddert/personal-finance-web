import { Model } from 'objection'
import knex from '../db/knex'

Model.knex(knex)

export default class Category extends Model {
    id?: number
    description?: string
    colour?: string
    static created_on: Date | string
    static updated_on: Date | string

    static get tableName() {
        return 'category'
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

    static afterFind() {
        this.created_on = this.created_on ? new Date(this.created_on).toISOString() : ''
        this.updated_on = this.updated_on ? new Date(this.updated_on).toISOString() : ''
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['colour', 'label', 'created_on', 'updated_on'],
            properties: {
                id: { type: 'number' },
                description: { type: ['string', 'null'] },
                colour: { type: 'string', minLength: 3 },
                created_on: { type: 'string' },
                updated_on: { type: 'string' },                
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
                    to: 'transaction.category_id',
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