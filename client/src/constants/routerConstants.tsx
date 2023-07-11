import { createBrowserRouter } from 'react-router-dom'

import ReceiptLong from '@mui/icons-material/ReceiptLong'

import Home from '../pages/Home'

export const ROUTES = Object.freeze({
    HOME: '/',
    TRANSACTIONS: '/transactions',
})

// export const GO = Object.freeze({
//     HOME: () => push(ROUTES.HOME)
// })

const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: <Home />,
    },
])

export const navigation = [
    {
        label: 'Transactions',
        Icon: ReceiptLong,
        location: ROUTES.TRANSACTIONS,
    },
]

export default router
