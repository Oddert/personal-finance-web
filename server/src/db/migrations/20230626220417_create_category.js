/* eslint-disable no-undef */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('category', table => {
        table.increments('id').primary()
        table.string('label')
        table.string('description')
        table.string('colour')
        table.date('created_on')
        table.date('updated_on')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('category')
}
