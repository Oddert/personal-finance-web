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

export const getRangeKeyEncoding = (year: string, month: string) => {
    return `${month + 1}-${year}`
}

const getMonthFromRangeKey = (rangeKey: string) => {
    const dateComponents: string[] = rangeKey.split('-')
    const months: { [month: string]: string } = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
    }
    return [months[dateComponents[0]], dateComponents[1]]
}

export const generateMarks = (keysArray: string[]) => {
    let markStepSize = 1
    if (keysArray.length > 47) {
        markStepSize = 6
    } else if (keysArray.length > 23) {
        markStepSize = 3
    } else if (keysArray.length > 14) {
        markStepSize = 2
    }
    
    const marks: { value: number, label: string }[] = []

    for (let i = 0; i < keysArray.length; i+= markStepSize) {
        const [monthLabel, yearLabel] = getMonthFromRangeKey(keysArray[i])
        marks.push({
            value: i,
            label: (i === 0 || monthLabel === 'Jan')
                ? `${monthLabel} ${yearLabel}`
                : monthLabel
        })
    }
    return marks
}
