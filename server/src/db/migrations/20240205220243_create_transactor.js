/* eslint-disable no-undef */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactor', table => {
        table.increments('id').primary()
        table.date('created_on').notNullable()
        table.date('updated_on').notNullable()
        table.string('description').notNullable()
        table.boolean('is_addition').notNullable().defaultTo(false)
        table.integer('value').notNullable().defaultTo(0)
        table.integer('scenario_id').references('scenario.id')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('transactor')
}
