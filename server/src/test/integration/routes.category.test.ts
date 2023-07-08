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

describe('[INTEGRATION] routes : category', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })

    afterEach(() => knex.migrate.rollback(migrateOpts))

    describe('POST /category', () => {
        it('should create a new category', done => {
            const date = new Date()
            const catLabel = `TEST_CATEGORY_LABEL_${date.toString()}`
            const catDesc = `TEST_CATEGORY_DESCRIPTION_${date.toString()}`
            const catColour = '#bec3c7'
            let initialLength = 0

            chai.request(server)
                .get('/category')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    expect(res.body.payload.categories).to.have.lengthOf.above(0)
                    initialLength = res.body.payload.categories.length

                    chai.request(server)
                        .post('/category')
                        .set('Content-Type', 'application/json')
                        .send({
                            label: catLabel,
                            description: catDesc,
                            colour: catColour,
                        })
                        .end((err, res) => {
                            should.not.exist(err)
                            res.redirects.length.should.eql(0)
                            res.status.should.eql(201)
                            res.type.should.eql('application/json')
        
                            res.body.status.should.eql(res.status)
                            expect(res.body.payload.category).to.be.a('object')
                            expect(res.body.payload.category).to.have.all.keys(
                                'id',
                                'label',
                                'description',
                                'colour',
                                'created_on',
                                'updated_on',
                            )
                            expect(res.body.payload.category.id).to.be.a('number')
                            expect(res.body.payload.category.label).to.eql(catLabel)
                            expect(res.body.payload.category.description).to.eql(catDesc)
                            expect(res.body.payload.category.colour).to.eql(catColour)
                            expect(res.body.payload.category.created_on).to.be.a('string')
                            expect(res.body.payload.category.updated_on).to.be.a('string')

                            chai.request(server)
                                .get('/category')
                                .set('Content-Type', 'application/json')
                                .send()
                                .end((err, res) => {
                                    should.not.exist(err)
                                    res.redirects.length.should.eql(0)
                                    res.status.should.eql(200)
                                    res.type.should.eql('application/json')
                                    expect(res.body.payload.categories).to.have.lengthOf(initialLength + 1)
                                    done()
                                })
                        })
                })
        })
    })
})