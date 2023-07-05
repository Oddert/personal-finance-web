/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: __dirname + '/db/personal-finance.dev.db3'
        },
        useNullAsDefault: true,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds'
        }
    },

    staging: {
        client: 'sqlite3',
        connection: {
            filename: __dirname + '/db/personal-finance.staging.db3'
        },
        useNullAsDefault: true,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds'
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user:     'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

}

module.exports = config
