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

describe('[INTEGRATION] routes : matcher', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })

    afterEach(() => knex.migrate.rollback(migrateOpts))

    
    describe('POST /matcher', () => {
        it('should create a new matcher', done => {
            const date = new Date()
            const matchName = `TEST_MATCHER_${date.toString()}`
            let initialLength = 0

            chai.request(server)
                .get('/matcher')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    expect(res.body.payload.matchers).to.have.lengthOf.above(0)
                    initialLength = res.body.payload.matchers.length

                    chai.request(server)
                        .post('/matcher')
                        .set('Content-Type', 'application/json')
                        .send({
                            match: matchName,
                            match_type: 'any',
                            case_sensitive: false,
                        })
                        .end((err, res) => {
                            should.not.exist(err)
                            res.redirects.length.should.eql(0)
                            res.status.should.eql(201)
                            res.type.should.eql('application/json')
        
                            res.body.status.should.eql(res.status)
                            expect(res.body.payload.matcher).to.be.a('object')
                            expect(res.body.payload.matcher).to.have.all.keys(
                                'id',
                                'match',
                                'match_type',
                                'case_sensitive',
                                'created_on',
                                'updated_on',
                            )
                            expect(res.body.payload.matcher.id).to.be.a('number')
                            expect(res.body.payload.matcher.match).to.eql(matchName)
                            expect(res.body.payload.matcher.match_type).to.eql('any')
                            expect(res.body.payload.matcher.case_sensitive).to.be.oneOf([0, false])
                            expect(res.body.payload.matcher.created_on).to.be.a('string')
                            expect(res.body.payload.matcher.updated_on).to.be.a('string')
                            expect(res.body.payload.matcher.updated_on).to.eql(res.body.payload.matcher.created_on)

                            chai.request(server)
                                .get('/matcher')
                                .set('Content-Type', 'application/json')
                                .send()
                                .end((err, res) => {
                                    should.not.exist(err)
                                    res.redirects.length.should.eql(0)
                                    res.status.should.eql(200)
                                    res.type.should.eql('application/json')
                                    expect(res.body.payload.matchers).to.have.lengthOf(initialLength + 1)
                                    done()
                                })
                        })
                })
        })
    })
})