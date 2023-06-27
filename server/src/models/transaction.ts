import { Model } from 'objection'
import knex from '../db/knex'

Model.knex(knex)

export default class Transaction extends Model {
    static get tableName() {
        return 'transaction'
    }

    static get relationMappings() {
		const Category = __dirname + './Category' // require('./User')
        return {
            category: {
                relation: Model.HasOneRelation,
                modelClass: Category,
                join: {
                    from: 'transaction.id',
                    to: 'category.id',
                }
            }
        }
    }
}