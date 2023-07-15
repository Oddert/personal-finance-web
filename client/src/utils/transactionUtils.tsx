import { CellContext, ColumnDef } from '@tanstack/react-table'

import { Box } from '@mui/material'

import { LOCALE } from '../constants/appConstants'

import { Transaction } from '../types/Transaction'

import type { CategoryState } from '../redux/slices/categorySlice'

import { createReadableNumber } from './commonUtils'
import { Category } from '../types/Category'

export const mapCategoriesToTransactions = (
    transactions: Transaction[],
    orderedCategories: CategoryState['orderedData']['byId'],
) => {
    const mappedTransactions = transactions.map((transaction) => {
        if (transaction.category_id && transaction.category_id in orderedCategories) {
            return {
                ...transaction,
                assignedCategory: orderedCategories[transaction.category_id],
            }
        }
        return transaction
    })
    return mappedTransactions
}

export const orderTransactions = (transactions: Transaction[]) => {
    const orderedByDate: { [year: string]: { [month: number]: Transaction[] } } = {}
    const orderedByCategory: { [category: number|string]: Transaction[] } = { default: [] }

    transactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const year = date.getFullYear()
        const month = date.getMonth()
        const category = transaction.category_id || 'default'

        if (!(year in orderedByDate)) {
            orderedByDate[year] = {}
        }
        if (!(month in orderedByDate[year])) {
            orderedByDate[year][month] = []
        }
        if (!(category in orderedByCategory)) {
            orderedByCategory[category] = []
        }

        orderedByDate[year][month].push(transaction)
        orderedByCategory[category].push(transaction)
    })
    return {
        byCategory: orderedByCategory,
        byDate: orderedByDate,
    }
}

export const addCurrencySymbol = (cell: CellContext<Transaction, unknown>) => {
    const value = createReadableNumber(cell.renderValue(), 0)
    return (
        <Box sx={{ textAlign: 'right' }}>
            £{value}
        </Box>
    )
}

export const transactionColumns: ColumnDef<Transaction>[] = [
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
        header: 'Category',
        accessorKey: 'assignedCategory',
        cell: (cell) => {
            const value: Category|unknown = cell.renderValue()
            if (value && typeof value === 'object' && 'label' in value) {
                return value.label
            }
            return null
        }
    },
    {
        header: 'CatId',
        accessorKey: 'category_id',
    }
]