import { useSelector } from 'react-redux'
import type { CellContext, ColumnDef } from '@tanstack/react-table'

import { Box, Button, Container, Input, Typography } from '@mui/material'

import { Transaction } from '../../types/Transaction'

import { LOCALE } from '../../constants/appConstants'

import { RootState } from '../../redux/constants/store'
import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors'

import Table from '../../components/Table'

const createReadableNumber = (value: unknown, fallbackValue?: number) => {
    if (typeof value !== 'number') {
        return fallbackValue;
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const addCurrencySymbol = (cell: CellContext<Transaction, unknown>) => {
    const value = createReadableNumber(cell.renderValue(), 0)
    return (
        <Box sx={{ textAlign: 'right' }}>
            £{value}
        </Box>
    )
}

const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: 'Date',
        accessorKey: 'date',
        cell: (cell) => {
            const value = cell.renderValue()
            if (typeof value === 'number') {
                return new Date(value).toLocaleDateString(LOCALE)
            }
            return value
        }
    },
    {
        header: 'Description',
        accessorKey: 'description'
    },
    {
        header: 'Out',
        accessorKey: 'debit',
        cell: addCurrencySymbol,
    },
    {
        header: 'In',
        accessorKey: 'credit',
        cell: addCurrencySymbol,
    },
    {
        header: 'Ballance',
        accessorKey: 'ballance',
        cell: addCurrencySymbol,
    },
    {
        header: 'Category ID',
        accessorKey: 'category_id'
    },
]

const Transactions = () => {
    const transactions = useSelector<RootState, Transaction[]>(state => getTransactionsResponse(state))

    return (
        <Container>
            <Typography variant='h2'>Transactions</Typography>
            <Box>
                <Input type='date'  />
                <Input type='date' />
                <Button>Get transactions</Button>
            </Box>
            <Table<Transaction> data={transactions} columns={transactionColumns}  />
        </Container>
    )
}

export default Transactions
