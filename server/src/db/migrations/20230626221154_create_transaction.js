/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transaction', table => {
        table.increments('id').primary()
        table.date('date')
        table.string('transaction_type', 5)
        table.string('description')
        table.integer('debit')
        table.integer('credit')
        table.integer('ballance')
        table.date('created_on')
        table.date('updated_on')
        table.integer('category_id').references('category.id')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transaction')
}
