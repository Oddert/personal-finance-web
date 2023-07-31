import { createBrowserRouter } from 'react-router-dom'

import CategoryIcon from '@mui/icons-material/Category'
import TransactionsIcon from '@mui/icons-material/ReceiptLong'

import Layout from '../components/Layout'

import Categories from '../pages/Categories/'
import Home from '../pages/Home'
import Transactions from '../pages/Transactions/'

export const ROUTES = Object.freeze({
    HOME: '/',
    TRANSACTIONS: '/transactions',
    CATEGORIES: '/categories',
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
]

export default router
