const knex = require('knex')

const config = require('../knexfile')

const environment = process.env.NODE_ENV || 'development'

const selectedConfig = config[environment]

const Knex = knex(selectedConfig)

module.exports = Knex
