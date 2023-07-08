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

describe('[INTEGRATION] routes : transaction', () => {
    beforeEach(() => {
        return knex.migrate.rollback(migrateOpts)
            .then(() => knex.migrate.latest(migrateOpts))
            .then(() => knex.seed.run(seedOpts))
    })

    afterEach(() => knex.migrate.rollback(migrateOpts))

    
    describe('POST /transaction', () => {
        it('should create a new transaction and change the length of the total array', done => {
            const date = new Date()
            
            const transDate = '21/09/2023'
            const transType = 'DEB'
            const description = `TEST_TRANSACTION_${date.toString()}`
            const debit = 98.1
            const credit = 0
            const ballance = 174.22
            
            let initialLength = 0

            chai.request(server)
                .get('/transaction')
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    expect(res.body.payload.transactions).to.have.lengthOf.above(0)
                    initialLength = res.body.payload.transactions.length

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

                            chai.request(server)
                                .get('/transaction')
                                .set('Content-Type', 'application/json')
                                .send()
                                .end((err, res) => {
                                    should.not.exist(err)
                                    res.redirects.length.should.eql(0)
                                    res.status.should.eql(200)
                                    res.type.should.eql('application/json')
                                    expect(res.body.payload.transactions).to.have.lengthOf(initialLength + 1)
                                    done()
                                })
                        })
                })
        })
    })

    describe('POST /transaction', () => {
        it('should add a transaction, a category and some matchers', done => {
            const schema = {
                date: '17/06/2022',
                transaction_type: 'DEB',
                description: 'Integration test new description',
                debit: 52,
                credit: 0,
                ballance: 76.34,
                assignedCategory: {
                    label: 'Integration Test New Category',
                    description: '',
                    colour: '#ecf0f1',
                    matchers: [
                        {
                            match: 'ITM1',
                            match_type: 'end',
                            case_sensitive: true,
                        },
                        {
                            match: 'ITM2',
                            match_type: 'start',
                            case_sensitive: true,
                        },
                        {
                            match: 'ITM3',
                            match_type: 'any',
                            case_sensitive: false,
                        },
                    ],
                },
            }

            chai.request(server)
                .post('/transaction')
                .set('Content-Type', 'application/json')
                .send(schema)
                .end((err, res) => {
                    should.not.exist(err)
                    res.redirects.length.should.eql(0)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    
                    res.body.status.should.eql(res.status)

                    const transaction = res.body.payload.transaction

                    expect(transaction).to.be.a('object')
                    expect(transaction).to.have.all.keys(
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
                        'assignedCategory'
                    )
                    expect(transaction.id).to.be.a('number')
                    expect(transaction.date).to.eql(schema.date)
                    expect(transaction.transaction_type).to.eql(schema.transaction_type)
                    expect(transaction.description).to.eql(schema.description)
                    expect(transaction.debit).to.eql(schema.debit)
                    expect(transaction.credit).to.eql(schema.credit)
                    expect(transaction.ballance).to.eql(schema.ballance)
                    expect(transaction.category_id).to.be.a('number')
                    expect(transaction.created_on).to.be.a('string')
                    expect(transaction.updated_on).to.be.a('string')
                    expect(transaction.updated_on).to.eql(transaction.created_on)

                    expect(transaction.assignedCategory).to.be.a('object')
                    expect(transaction.assignedCategory).to.have.all.keys(
                        'id',
                        'label',
                        'description',
                        'colour',
                        'created_on',
                        'updated_on',
                        'matchers',
                    )
                    expect(transaction.assignedCategory.id).to.be.a('number')
                    expect(transaction.assignedCategory.label).to.be.a('string')
                    expect(transaction.assignedCategory.description).to.be.a('string')
                    expect(transaction.assignedCategory.colour).to.be.a('string')
                    expect(transaction.assignedCategory.matchers).to.be.a('array')
                    expect(transaction.assignedCategory.created_on).to.be.a('string')
                    expect(transaction.assignedCategory.updated_on).to.be.a('string')
                    expect(transaction.assignedCategory.updated_on).to.eql(transaction.assignedCategory.created_on)

                    expect(transaction.assignedCategory.matchers[0]).to.be.a('object')
                    expect(transaction.assignedCategory.matchers[0]).to.have.all.keys(
                        'id',
                        'match',
                        'match_type',
                        'case_sensitive',
                        'created_on',
                        'updated_on',
                    )
                    done()
                })

        })
    })
})