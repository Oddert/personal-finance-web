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

describe('[UNIT] routes : transaction', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })

    afterEach(() => {
        return knex.migrate.rollback(migrateOpts)
    })

    describe('GET /transaction', () => {
        it('should retrieve all transactions', done => {
            chai.request(server)
                .get('/transaction')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.transactions).to.have.lengthOf.above(0)
                    expect(res.body.payload.transactions[0]).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                    )
                    expect(res.body.payload.transactions[0].id).to.be.a('number')
                    expect(res.body.payload.transactions[0].date).to.be.a('number')
                    expect(res.body.payload.transactions[0].transaction_type).to.be.a('string')
                    expect(res.body.payload.transactions[0].description).to.be.a('string')
                    expect(res.body.payload.transactions[0].debit).to.be.a('number')
                    expect(res.body.payload.transactions[0].credit).to.be.a('number')
                    expect(res.body.payload.transactions[0].ballance).to.be.a('number')
                    expect(res.body.payload.transactions[0].created_on).to.be.a('string')
                    expect(res.body.payload.transactions[0].updated_on).to.be.a('string')
                    expect(res.body.payload.transactions[0].category_id).to.be.a('number')
                    done()
                })
        })
    })

    describe('GET /transaction?includeCategory=true', () => {
        it('should retrieve all transactions with category information', done => {
            chai.request(server)
                .get('/transaction?includeCategory=true')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.transactions).to.have.lengthOf.above(0)
                    expect(res.body.payload.transactions[0]).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                        'assignedCategory',
                    )
                    expect(res.body.payload.transactions[0].assignedCategory).to.be.a('object')
                    expect(res.body.payload.transactions[0].assignedCategory).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                    )
                    done()
                })
        })
    })

    describe('GET /transaction/:id', () => {
        it('should retrieve a single transaction', done => {
            chai.request(server)
                .get('/transaction/1')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.transaction).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                    )
                    expect(res.body.payload.transaction.id).to.eql(1)
                    expect(res.body.payload.transaction.date).to.be.a('number')
                    expect(res.body.payload.transaction.transaction_type).to.be.a('string')
                    expect(res.body.payload.transaction.description).to.be.a('string')
                    expect(res.body.payload.transaction.debit).to.be.a('number')
                    expect(res.body.payload.transaction.credit).to.be.a('number')
                    expect(res.body.payload.transaction.ballance).to.be.a('number')
                    expect(res.body.payload.transaction.created_on).to.be.a('string')
                    expect(res.body.payload.transaction.updated_on).to.be.a('string')
                    expect(res.body.payload.transaction.category_id).to.be.a('number')
                    done()
                })
        })
    })

    describe('GET /transaction/:id?includeCategory=true', () => {
        it('should retrieve a single transaction with category information', done => {
            chai.request(server)
                .get('/transaction/1?includeCategory=true')
                .set('Content-Type', 'application/json')
                .send()
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.transaction).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                        'assignedCategory',
                    )
                    expect(res.body.payload.transaction.assignedCategory).to.be.a('object')
                    expect(res.body.payload.transaction.assignedCategory).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                    )
                    done()
                })
        })
    })

    describe('POST /transaction', () => {
        it('should create a new transaction', done => {
            const date = new Date()
            
            const transDate = new Date('23 june 2023').getTime()
            const transType = 'DEB'
            const description = `TEST_TRANSACTION_${date.toString()}`
            const debit = 23
            const credit = 0
            const ballance = 934.17

            chai.request(server)
                .post('/transaction')
                .set('Content-Type', 'application/json')
                .send({
                    date: transDate,
                    transaction_type: transType,
                    description: description,
                    debit: debit,
                    credit: credit,
                    ballance: ballance,
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
        
                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.transaction).to.be.a('object')
                    expect(res.body.payload.transaction).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                    )
                    expect(res.body.payload.transaction.id).to.be.a('number')
                    expect(res.body.payload.transaction.date).to.eql(transDate)
                    expect(res.body.payload.transaction.transaction_type).to.eql(transType)
                    expect(res.body.payload.transaction.description).to.eql(description)
                    expect(res.body.payload.transaction.debit).to.eql(debit)
                    expect(res.body.payload.transaction.credit).to.eql(credit)
                    expect(res.body.payload.transaction.ballance).to.eql(ballance)
                    expect(res.body.payload.transaction.created_on).to.be.a('string')
                    expect(res.body.payload.transaction.updated_on).to.be.a('string')
                    expect(res.body.payload.transaction.updated_on).to.eql(res.body.payload.transaction.created_on)
                    done()
                })
        })
    })

    describe('PUT /transaction/1', () => {
        it('should update a single transaction', done => {
            const date = new Date()

            const transDate = new Date('30 july 2022').getTime()
            const transType = 'DEB'
            const description = `TEST_TRANSACTION_${date.toString()}`
            const debit = 52
            const credit = 0
            const ballance = 622.97

            chai.request(server)
                .put('/transaction/1')
                .set('Content-Type', 'application/json')
                .send({
                    date: transDate,
                    transaction_type: transType,
                    description: description,
                    debit: debit,
                    credit: credit,
                    ballance: ballance,
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    
                    expect(res.body.payload.transaction).to.be.a('object')
                    expect(res.body.payload.transaction).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                    )
                    expect(res.body.payload.transaction.id).to.eql(1)
                    expect(res.body.payload.transaction.date).to.eql(transDate)
                    expect(res.body.payload.transaction.transaction_type).to.eql(transType)
                    expect(res.body.payload.transaction.description).to.eql(description)
                    expect(res.body.payload.transaction.debit).to.eql(debit)
                    expect(res.body.payload.transaction.credit).to.eql(credit)
                    expect(res.body.payload.transaction.ballance).to.eql(ballance)
                    expect(res.body.payload.transaction.created_on).to.be.a('string')
                    expect(res.body.payload.transaction.updated_on).to.be.a('string')
                    expect(res.body.payload.transaction.updated_on).to.not.eql(res.body.payload.transaction.created_on)
                    done()
                })
        })
    })

    describe('DELETE /transaction/1', () => {
        it('should delete a single transaction', done => {
            chai.request(server)
                .get('/transaction/1')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')

                    res.body.status.should.eql(res.status)
                    expect(res.body.payload.transaction).to.have.all.keys(
                        'id',
                        'date',
                        'transaction_type',
                        'description',
                        'debit',
                        'credit',
                        'ballance',
                        'created_on',
                        'updated_on',
                        'category_id',
                    )
                    expect(res.body.payload.transaction.id).to.eql(1)
                    expect(res.body.payload.transaction.date).to.be.a('number')
                    expect(res.body.payload.transaction.transaction_type).to.be.a('string')
                    expect(res.body.payload.transaction.description).to.be.a('string')
                    expect(res.body.payload.transaction.debit).to.be.a('number')
                    expect(res.body.payload.transaction.credit).to.be.a('number')
                    expect(res.body.payload.transaction.ballance).to.be.a('number')
                    expect(res.body.payload.transaction.created_on).to.be.a('string')
                    expect(res.body.payload.transaction.updated_on).to.be.a('string')
                    expect(res.body.payload.transaction.category_id).to.be.a('number')

                    chai.request(server)
                        .delete('/transaction/1')
                        .set('Content-Type', 'application/json')
                        .end((err, res) => {
                            should.not.exist(err)
                            res.redirects.length.should.eql(0)
                            res.status.should.eql(204)

                            chai.request(server)
                                .get('/transaction/1')
                                .set('Content-Type', 'application/json')
                                .end((err, res) => {
                                    should.not.exist(err)
                                    res.redirects.length.should.eql(0)
                                    res.status.should.eql(404)
                                    res.type.should.eql('application/json')
                                    expect(res.body.payload.transaction).to.not.exist
                                    done()
                                })
                        })
                })
        })
    })
})