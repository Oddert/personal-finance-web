/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('matcher', table => {
        table.increments('id').primary()
        table.string('match')
        table.string('match_type')
        table.boolean('case_sensitive')
        table.date('created_on')
        table.date('updated_on')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('matcher')
}
