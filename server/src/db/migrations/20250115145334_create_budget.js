/* eslint-disable no-undef */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('budget', (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('short_desc').defaultTo('')
        table.string('long_desc').defaultTo('')
        table.date('created_on')
        table.date('updated_on')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('budget')
}
