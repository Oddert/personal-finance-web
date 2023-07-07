import { Model } from 'objection'
import knex from '../db/knex'

Model.knex(knex)

export default class Matcher extends Model {
    id?: number
    match?: string
    match_type?: string
    case_sensitive?: boolean
    created_on: Date | number | string
    updated_on: Date | number | string
    static created_on: string
    static updated_on: string

    static get tableName() {
        return 'matcher'
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
            required: ['match', 'match_type', 'case_sensitive'],
            properties: {
                id: { type: 'number' },
                match: { type: 'string', minLength: 1 },
                match_type: { type: 'string', minLength: 1 },
                case_sensitive: { type: 'boolean' },
                created_on: { type: 'string' },
                updated_on: { type: 'string' },
            }
        }
    }

    static get relationMappings() {
        const Category = __dirname + '/Category' // require('./User')
        return {
            categories: {
                relation: Model.ManyToManyRelation,
                modelClass: Category,
                join: {
                    from: 'matcher.id',
                    through: {
                        from: 'category_matcher.matcher_id',
                        to: 'category_matcher.category_id',
                    },
                    to: 'category.id',
                }
            },
        }
    }
}