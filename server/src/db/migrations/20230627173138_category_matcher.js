/* eslint-disable no-undef */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('category_matcher', table => {
        table.increments('id').primary()
        table.integer('category_id').references('id').inTable('category')
        table.integer('matcher_id').references('id').inTable('matcher')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('category_matcher')
}
