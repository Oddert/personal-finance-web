/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('scenario', table => {
        table.increments('id').primary()
        table.integer('start_date').defaultTo(null)
        table.integer('end_date').defaultTo(null)
        table.date('created_on').notNullable()
        table.date('updated_on').notNullable()
        table.string('title').defaultTo('')
        table.string('description').defaultTo('')
        table.integer('start_ballance').defaultTo(null)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('scenario')
};
