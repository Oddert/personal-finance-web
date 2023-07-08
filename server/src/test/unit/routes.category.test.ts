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

describe('[UNIT] routes : category', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })
    
    afterEach(() => {
        return knex.migrate.rollback(migrateOpts)
    })

    describe('GET /category', () => {
        it('should retrieve all categories', done => {
            chai.request(server)
                .get('/category')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.categories).to.have.lengthOf.above(0)
                    expect(res.body.payload.categories[0]).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                    )
                    expect(res.body.payload.categories[0].id).to.be.a('number')
                    expect(res.body.payload.categories[0].label).to.be.a('string')
                    expect(res.body.payload.categories[0].description).to.be.a('string')
                    expect(res.body.payload.categories[0].colour).to.be.a('string')
                    expect(res.body.payload.categories[0].created_on).to.be.a('string')
                    expect(res.body.payload.categories[0].updated_on).to.be.a('string')
                    done()
                })
        })
    })

    describe('GET /category?includeMatchers=true', () => {
        it('should retrieve all categories with matchers joined', done => {
            chai.request(server)
                .get('/category?includeMatchers=true')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    
                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.categories).to.have.lengthOf.above(0)
                    expect(res.body.payload.categories[0]).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                        'matchers',
                    )
                    expect(res.body.payload.categories[0].matchers).to.exist
                    expect(res.body.payload.categories[0].matchers).to.be.a('array')
                    expect(res.body.payload.categories[0].matchers[0]).to.be.a('object')

                    expect(res.body.payload.categories[0].matchers[0].id).to.be.a('number')
                    expect(res.body.payload.categories[0].matchers[0].match).to.be.a('string')
                    expect(res.body.payload.categories[0].matchers[0].match_type).to.be.a('string')
                    expect(res.body.payload.categories[0].matchers[0].case_sensitive).to.be.oneOf(['boolean', 0, 1])
                    expect(res.body.payload.categories[0].matchers[0].created_on).to.be.a('string')
                    expect(res.body.payload.categories[0].matchers[0].updated_on).to.be.a('string')
                    done()
                })
        })
    })

    describe('GET /category/:id', () => {
        it('should retrieve a single category', done => {
            chai.request(server)
                .get('/category/1')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.category).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                    )
                    expect(res.body.payload.category.id).to.be.a('number')
                    expect(res.body.payload.category.label).to.be.a('string')
                    expect(res.body.payload.category.description).to.be.a('string')
                    expect(res.body.payload.category.colour).to.be.a('string')
                    expect(res.body.payload.category.created_on).to.be.a('string')
                    expect(res.body.payload.category.updated_on).to.be.a('string')
                    done()
                })
        })
    })

    describe('GET /category/:id?includeMatchers=true', () => {
        it('should retrieve a category with matchers joined', done => {
            chai.request(server)
                .get('/category/1?includeMatchers=true')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    
                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.category).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                        'matchers',
                    )
                    expect(res.body.payload.category.matchers).to.exist
                    expect(res.body.payload.category.matchers).to.be.a('array')
                    expect(res.body.payload.category.matchers[0]).to.be.a('object')

                    expect(res.body.payload.category.matchers[0].id).to.be.a('number')
                    expect(res.body.payload.category.matchers[0].match).to.be.a('string')
                    expect(res.body.payload.category.matchers[0].match_type).to.be.a('string')
                    expect(res.body.payload.category.matchers[0].case_sensitive).to.be.oneOf(['boolean', 0, 1])
                    expect(res.body.payload.category.matchers[0].created_on).to.be.a('string')
                    expect(res.body.payload.category.matchers[0].updated_on).to.be.a('string')
                    done()
                })
        })
    })

    describe('POST /category', () => {
        it('should create a new category', done => {
            const date = new Date()
            const catLabel = `TEST_CATEGORY_LABEL_${date.toString()}`
            const catDesc = `TEST_CATEGORY_DESCRIPTION_${date.toString()}`
            const catColour = '#ecf0f1'

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
                    done()
                })
        })

        it('should create a new category with matchers', done => {
            const date = new Date()
            const catLabel = `TEST_CATEGORY_LABEL_${date.toString()}`
            const catDesc = `TEST_CATEGORY_DESCRIPTION_${date.toString()}`
            const catColour = '#ecf0f1'

            const matchName = `TEST_MATCHER_${date.toString()}`
            const matchType = 'any'

            chai.request(server)
                .post('/category')
                .set('Content-Type', 'application/json')
                .send({
                    label: catLabel,
                    description: catDesc,
                    colour: catColour,
                    matchers: [
                        {
                            match: matchName,
                            match_type: matchType,
                            case_sensitive: false,
                        }
                    ]
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
                        'matchers',
                    )
                    expect(res.body.payload.category.id).to.be.a('number')
                    expect(res.body.payload.category.label).to.eql(catLabel)
                    expect(res.body.payload.category.description).to.eql(catDesc)
                    expect(res.body.payload.category.colour).to.eql(catColour)
                    expect(res.body.payload.category.created_on).to.be.a('string')
                    expect(res.body.payload.category.updated_on).to.be.a('string')

                    expect(res.body.payload.category.matchers[0]).to.be.a('object')
                    expect(res.body.payload.category.matchers[0]).to.have.all.keys(
                        'id',
                        'match',
                        'match_type',
                        'case_sensitive',
                        'created_on',
                        'updated_on',
                    )
                    expect(res.body.payload.category.matchers[0].id).to.be.a('number')
                    expect(res.body.payload.category.matchers[0].match).to.eql(matchName)
                    expect(res.body.payload.category.matchers[0].match_type).to.eql(matchType)
                    expect(res.body.payload.category.matchers[0].case_sensitive).to.be.oneOf([0, false])
                    // expect(res.body.payload.category.matchers[0].created_on).to.be.a('string')
                    // expect(res.body.payload.category.matchers[0].updated_on).to.be.a('string')
                    // expect(res.body.payload.category.matchers[0].updated_on).to.eql(
                    //     res.body.payload.matcher.created_on
                    // )
                    done()
                })
            
        })
    })

    describe('PUT /category/2', () => {
        it('should update a single category', done => {
            const date = new Date()
            const catLabel = `TEST_CATEGORY_LABEL_${date.toString()}`
            const catDesc = `TEST_CATEGORY_DESCRIPTION_${date.toString()}`
            const catColour = '#ecf0f1'

            chai.request(server)
                .put('/category/2')
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
                    expect(res.body.payload.category.id).to.eql(2)
                    expect(res.body.payload.category.label).to.eql(catLabel)
                    expect(res.body.payload.category.description).to.eql(catDesc)
                    expect(res.body.payload.category.colour).to.eql(catColour)
                    expect(res.body.payload.category.created_on).to.be.a('string')
                    expect(res.body.payload.category.updated_on).to.be.a('string')
                    expect(res.body.payload.category.updated_on).to.not.eql(res.body.payload.category.created_on)
                    done()
                })
        })
    })

    describe('DELETE /category/3', () => {
        it('should delete a single category', done => {
            chai.request(server)
                .get('/category/3')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
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
                    expect(res.body.payload.category.label).to.be.a('string')
                    expect(res.body.payload.category.description).to.be.a('string')
                    expect(res.body.payload.category.colour).to.be.a('string')
                    expect(res.body.payload.category.created_on).to.be.a('string')
                    expect(res.body.payload.category.updated_on).to.be.a('string')

                    chai.request(server)
                        .delete('/category/3')
                        .set('Content-Type', 'application/json')
                        .end((err, res) => {
                            should.not.exist(err)
                            res.redirects.length.should.eql(0)
                            res.status.should.eql(204)

                            chai.request(server)
                                .get('/category/3')
                                .set('Content-Type', 'application/json')
                                .end((err, res) => {
                                    should.not.exist(err)
                                    res.redirects.length.should.eql(0)
                                    res.status.should.eql(404)
                                    res.type.should.eql('application/json')
                                    expect(res.body.payload.category).to.not.exist
                                    done()
                                })
                        })
                })
        })
    })
})