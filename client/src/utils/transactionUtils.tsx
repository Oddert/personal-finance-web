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
    const rawValue = createReadableNumber(cell.renderValue(), 0)
    const value = Number(rawValue)
    return (
        <Box sx={{ textAlign: 'right' }}>
            {
                isNaN(value) || value === 0
                    ? '-'
                    : `£${value.toFixed(2)}`
            }
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
            return '- uncategorised -'
        }
    },
    {
        header: 'Cat Id',
        accessorKey: 'category_id',
    }
]

/**
 * Creates a string format for month-year combinations.
 *
 * Using this allows a 'single source of truth' should the format ever need to change.
 * @param year The year code.
 * @param month The month number.
 * @returns The encoded string.
 */
export const getRangeKeyEncoding = (year: string, month: string) => {
    const adjustedMonth = Number(month) + 1
    const stringMonth = adjustedMonth >= 10 ? adjustedMonth : `0${adjustedMonth}`
    return `${stringMonth}-${year}`
}

/**
 * Splits a date encoded with {@link getRangeKeyEncoding} into a readable month and year.
 *
 * Returns the month and year pair with the month converted to three character notation (e.g. Jan, Feb, Mar...)
 * @param rangeKey A rangeKey string to be interpreted.
 * @returns The month converted and the year.
 */
const getMonthFromRangeKey = (rangeKey: string): [string, string] => {
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

/**
 * Converts a list of range-key-encoded date strings to values for the range selector.
 *
 * The values are index based starting at 0, the labels are three-character month strings except at year boundaries where the year is also included.
 * @param keysArray List of date strings encoded with {@link getRangeKeyEncoding}
 * @returns List of values for the Range component.
 */
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
