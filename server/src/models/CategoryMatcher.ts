import { Model } from 'objection'

import knex from '../db/knex'

Model.knex(knex)

export default class CategoryMatcher extends Model {
    id?: 'integer'
    category?: 'integer'
    matcher_id?: 'integer'

    static get tableName() {
        return 'category_matcher'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['category', 'matcher_id'],
            properties: {
                id: { type: 'number' },               
                category: { type: 'number' },               
                matcher_id: { type: 'number' },               
            }
        }
    }

    static get relationMappings() {
        const Category = __dirname + '/Category' // require('./User')
        const Matcher = __dirname + '/Matcher' // require('./User')
        return {
            categories: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'category_matcher.category_id',
                    to: 'category.id',
                }
            },
            matchers: {
                relation: Model.BelongsToOneRelation,
                modelClass: Matcher,
                join: {
                    from: 'category_matcher.matcher_id',
                    to: 'category.id',
                }
            },
        }
    }
}