import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import root from './routes/root'
import category from './routes/CategoryRoutes'
import matcher from './routes/MatcherRoutes'
import transaction from './routes/TransactionRoutes'
import debug from './routes/DebutRoutes'

dotenv.config()

const PORT = process.env.PORT || '8080'

const app = express()

app.use(
    morgan('[morgan] :method :url :status :res[content-length] - :response-time ms')
)

app.use(express.static('./'))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(express.json())
app.use(cors())

app.use('/', root)
app.use('/matcher', matcher)
app.use('/category', category)
app.use('/transaction', transaction)
app.use('/debug', debug)

const server = app.listen(
    PORT,
    () => `[${new Date().toLocaleString('en-GB')}] Server initialised on PORT: ${PORT}`
)
export default server
