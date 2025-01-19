import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import root from './routes/root'
import budget from './routes/BudgetRoutes'
import category from './routes/CategoryRoutes'
import debug from './routes/DebugRoutes'
import matcher from './routes/MatcherRoutes'
import scenario from './routes/ScenarioRoutes'
import transaction from './routes/TransactionRoutes'

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
app.use('/budget', budget)
app.use('/category', category)
app.use('/debug', debug)
app.use('/matcher', matcher)
app.use('/scenario', scenario)
app.use('/transaction', transaction)

const server = app.listen(
    PORT,
    () => `[${new Date().toLocaleString('en-GB')}] Server initialised on PORT: ${PORT}`
)
export default server
