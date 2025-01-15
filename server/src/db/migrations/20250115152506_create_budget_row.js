/* eslint-disable no-undef */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('budget_row', (table) => {
        table.increments('id').primary()
        table.integer('budget_id').references('budget.id').notNullable()
        table.integer('category_id').references('category.id').notNullable()
        table.string('label').notNullable()
        table.float('value').notNullable()
        table.float('var_low_pc').notNullable()
        table.float('var_high_pc').notNullable()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('budget_row')
}
