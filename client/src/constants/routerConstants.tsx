import { createBrowserRouter } from 'react-router-dom'

import CategoryIcon from '@mui/icons-material/Category'
import AllDataIcon from '@mui/icons-material/WaterfallChart'
import TransactionsIcon from '@mui/icons-material/ReceiptLong'

import Layout from '../components/Layout'

import AllData from '../pages/AllData'
import BudgetBreakdown from '../pages/BudgetBreakdown'
import Categories from '../pages/Categories/'
import Home from '../pages/Home'
import Transactions from '../pages/Transactions/'
import BudgetOverview from '../pages/BudgetOverview'

export const ROUTES = Object.freeze({
    HOME: '/',
    CATEGORIES: '/categories',
    BUDGET_BREAKDOWN: '/budget-breakdown',
    BUDGET_OVERVIEW: '/budget-overview',
    ALL_DATA: '/all-data',
    TRANSACTIONS: '/transactions',
})

// export const GO = Object.freeze({
//     HOME: () => push(ROUTES.HOME)
// })

const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: (
            <Layout>
                <Home />
            </Layout>
        ),
    },
    {
        path: ROUTES.TRANSACTIONS,
        element: (
            <Layout>
                <Transactions />
            </Layout>
        ),
    },
    {
        path: ROUTES.CATEGORIES,
        element: (
            <Layout>
                <Categories />
            </Layout>
        ),
    },
    {
        path: ROUTES.ALL_DATA,
        element: (
            <Layout>
                <AllData />
            </Layout>
        ),
    },
    {
        path: ROUTES.BUDGET_BREAKDOWN,
        element: (
            <Layout>
                <BudgetBreakdown />
            </Layout>
        ),
    },
    {
        path: ROUTES.BUDGET_OVERVIEW,
        element: (
            <Layout>
                <BudgetOverview />
            </Layout>
        ),
    },
])

export const navigation = [
    {
        label: 'Transactions',
        Icon: TransactionsIcon,
        location: ROUTES.TRANSACTIONS,
    },
    {
        label: 'Categories',
        Icon: CategoryIcon,
        location: ROUTES.CATEGORIES,
    },
    {
        label: 'All Data',
        Icon: AllDataIcon,
        location: ROUTES.ALL_DATA,
    },
    {
        label: 'Budget Breakdown',
        Icon: AllDataIcon,
        location: ROUTES.BUDGET_BREAKDOWN,
    },
    {
        label: 'Budget Overview',
        Icon: AllDataIcon,
        location: ROUTES.BUDGET_OVERVIEW,
    },
]

export default router
