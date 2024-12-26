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
    directory: path.join(__dirname, '../../db/migrations'),
}

const seedOpts = {
    directory: path.join(__dirname, '../../db/seeds'),
}

describe('[UNIT] routes : scenario', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })

    afterEach(() => {
        return knex.migrate.rollback(migrateOpts)
    })

    describe('GET /scenario', () => {
        it('should retrieve all scenarios', done => {
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
                    expect(res.body.payload.scenarios[0].id).to.be.a('number')
                    expect(res.body.payload.scenarios[0].start_date).to.be.a('string')
                    expect(res.body.payload.scenarios[0].end_date).to.be.a('string')
                    expect(res.body.payload.scenarios[0].created_on).to.be.a('string')
                    expect(res.body.payload.scenarios[0].updated_on).to.be.a('string')
                    expect(res.body.payload.scenarios[0].title).to.be.a('string')
                    expect(res.body.payload.scenarios[0].description).to.be.a('string')
                    expect(res.body.payload.scenarios[0].start_ballance).to.be.a('number')
                    expect(res.body.payload.scenarios[0].transactors).to.be.a('array')
                    done()
                })
        })
    })

    describe('POST /scenario', () => {
        it('should create a scenario', done => {
            const scenario = {
                start_date: '20 march 2024',
                end_date: '1 jan 2025',
                title: '[test] routes.scenario POST /scenario title',
                description: '[test] routes.scenario POST /scenario description',
                start_ballance: 7293,
            }
            
            chai.request(server)
                .post('/scenario')
                .set('Content-Type', 'application/json')
                .send(scenario)
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    
                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.scenario).to.have.all.keys(
                        'id',
                        'start_date',
                        'end_date',
                        'created_on',
                        'updated_on',
                        'title',
                        'description',
                        'start_ballance',
                    )
                    expect(res.body.payload.scenario.id).to.be.a('number')
                    expect(res.body.payload.scenario.start_date).to.eql(new Date(scenario.start_date).toISOString())
                    expect(res.body.payload.scenario.end_date).to.eql(new Date(scenario.end_date).toISOString())
                    expect(res.body.payload.scenario.created_on).to.be.a('string')
                    expect(res.body.payload.scenario.updated_on).to.be.a('string')
                    expect(res.body.payload.scenario.title).to.eql(scenario.title)
                    expect(res.body.payload.scenario.description).to.eql(scenario.description)
                    expect(res.body.payload.scenario.start_ballance).to.eql(scenario.start_ballance)

                    done()
                })
        })
    })

    describe('GET /scenario/:id', () => {
        it('should get a specific scenario', done => {
            chai.request(server)
                .get('/scenario/1')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.scenario).to.have.all.keys(
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
                    expect(res.body.payload.scenario.id).to.eql(1)

                    done()
                })
        })
    })

    describe('PUT /scenario/:id', () => {
        it('should update a scenario', done => {
            const scenario = {
                id: 1,
                start_date: '15 june 2024',
                end_date: '30 sept 2025',
                title: '[test] routes.scenario POST /scenario/:id title',
                description: '[test] routes.scenario POST /scenario/:id description',
                start_ballance: 4915,
            }
            chai.request(server)
                .put('/scenario/1')
                .set('Content-Type', 'application/json')
                .send(scenario)
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    
                    expect(res.body.payload.scenario.id).to.eql(scenario.id)
                    expect(res.body.payload.scenario.start_date).to.eql(new Date(scenario.start_date).toISOString())
                    expect(res.body.payload.scenario.end_date).to.eql(new Date(scenario.end_date).toISOString())
                    expect(res.body.payload.scenario.title).to.eql(scenario.title)
                    expect(res.body.payload.scenario.description).to.eql(scenario.description)
                    expect(res.body.payload.scenario.start_ballance).to.eql(scenario.start_ballance)

                    done()
                })
        })
    })

    describe('DELETE /scenario/:id', () => {
        it('should delete a scenario', done => {
            chai.request(server)
                .delete('/scenario/1')
                .set('Content-Type', 'application/json')
                .send({ id: 1 })
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')

                    expect(res.body.payload.deleted).to.eql(1)

                    done()
                })
        })
    })

    describe('POST /scenario/delete-many', () => {
        it('should delete multiple scenarios', done => {
            chai.request(server)
                .post('/scenario/delete-many')
                .set('Content-Type', 'application/json')
                .send({ scenarios: [0, 1, 2] })
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')

                    expect(res.body.payload.deletedScenarios).to.be.a('array')

                    done()
                })
        })
    })
})
