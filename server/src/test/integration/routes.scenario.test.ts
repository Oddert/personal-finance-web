import chai from 'chai'
import chaiHttp from 'chai-http'
import path from 'path'

import knex from '../../db/knex'

import server from '../../'

process.env.NODE_ENV = 'test'

chai.use(chaiHttp)

const should = chai.should()
const expect = chai.expect

const migrateOpts = {
    directory: path.join(__dirname, '../../db/migrations')
}

const seedOpts = {
    directory: path.join(__dirname, '../../db/seeds')
}

/**
 * Curried function which tests a value for null.
 *
 * Returns `true` if the item is null, otherwise returns the default value `other`.
 * @param other Default value to return.
 */
const nullOr = (other: string) => (s: any) => s === null || typeof s == other

describe('[INTEGRATION] routes : transaction', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })

    afterEach(() => knex.migrate.rollback(migrateOpts))

    describe('GET /scenario', () => {
        it('should retrieve all scenarios with transactors and schedulers', done => {
            chai.request(server)
                .get('/scenario')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.scenarios).to.have.lengthOf.above(0)
                    expect(res.body.payload.scenarios[0]).to.have.all.keys(
                        'id',
                        'start_date',
                        'end_date',
                        'created_on',
                        'updated_on',
                        'title',
                        'description',
                        'start_ballance',
                        'transactors',
                    )             
                    expect(res.body.payload.scenarios[0].transactors).to.be.a('array')
                    expect(res.body.payload.scenarios[0].transactors[0]).to.have.all.keys(
                        'id',
                        'created_on',
                        'updated_on',
                        'description',
                        'is_addition',
                        'value',
                        'scenario_id',
                        'schedulers',
                    )
                    expect(res.body.payload.scenarios[0].transactors[0].id).to.be.a('number')
                    expect(res.body.payload.scenarios[0].transactors[0].created_on).to.be.a('string')
                    expect(res.body.payload.scenarios[0].transactors[0].updated_on).to.be.a('string')
                    expect(res.body.payload.scenarios[0].transactors[0].description).to.be.a('string')
                    expect(res.body.payload.scenarios[0].transactors[0].is_addition).to.be.oneOf([0, 1, true, false])
                    expect(res.body.payload.scenarios[0].transactors[0].value).to.be.a('number')
                    expect(res.body.payload.scenarios[0].transactors[0].scenario_id).to.be.a('number')
                    expect(res.body.payload.scenarios[0].transactors[0].scenario_id).to.eql(res.body.payload.scenarios[0].id)
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers).to.be.a('array')
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0]).to.have.all.keys(
                        'id',
                        'scheduler_code',
                        'created_on',
                        'updated_on',
                        'step',
                        'start_date',
                        'day',
                        'nth_day',
                        'transactor_id',
                    )
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].id).to.be.a('number')
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].id).to.eql(res.body.payload.scenarios[0].transactors[0].id)
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].scheduler_code).to.be.a('string')
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].created_on).to.be.a('string')
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].updated_on).to.be.a('string')
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].step).to.satisfy(nullOr('string'))
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].start_date).to.satisfy(nullOr('number'))
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].day).to.satisfy(nullOr('number'))
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].nth_day).to.satisfy(nullOr('number'))
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].transactor_id).to.be.a('number')
                    expect(res.body.payload.scenarios[0].transactors[0].schedulers[0].transactor_id).to.eql(res.body.payload.scenarios[0].transactors[0].id)
                    done()
                })
        })
    })
})

// POST a scenario and check transactors / schedulers
// Create many scenarios and check transactors / schedulers
// POST and check scenarios length
// Update a scenario and check the transactors and schedulers
// Update a transactor and check its details (including schedulers)
// Delete a scenario and check it deleted the corresponding transactors and schedulers
// Delete a transactor and check its gone from scenario + check the schedulers are deleted
// Delete many scenarios and check the length is correct