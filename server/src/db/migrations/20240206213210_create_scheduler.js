/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('scheduler', table => {
        table.increments('id').primary()
        table.string('scheduler_code').notNullable()
        table.date('created_on')
        table.date('updated_on')
        table.integer('step').defaultTo(null)
        table.date('startDate').defaultTo(null)
        table.integer('day')
        table.integer('nth_day')
        table.integer('transactor_id').references('transactor.id')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('scheduler')
};
