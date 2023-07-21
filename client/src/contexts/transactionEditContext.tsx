import { createContext, Dispatch } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';

import { MenuItem, Select } from '@mui/material';

import type { Category } from '../types/Category'

interface TransactionEditState {
    columnMap: { [key: string]: string }
    transactions: { [key: string]: string|number }[]
    headers: string[]
}

const TransactionEditActionTypes = {
    setColumnMap: 'setColumnMap',
    updateCategory: 'updateCategory',
    writeHeaders: 'writeHeaders',
    writeTransactions: 'writeTransactions',
}

export const transactionEditInitialState: TransactionEditState = {
    columnMap: {
        'date': 'Transaction Date',
        'transaction_type': 'Transaction Type',
        'description': 'Transaction Description',
        'debit': 'Debit Amount',
        'credit': 'Credit Amount',
        'ballance': 'Balance',
    },
    headers: [],
    transactions: [],
}

export const defaultColumns = (
    categories?: Category[],
    callback?: (idx: number, assignedCategory: number) => void,
) => [
    {
        header: 'Date',
        accessorKey: 'date',
    },
    {
        header: 'Description',
        accessorKey: 'description'
    },
    {
        header: 'Out (debit)',
        accessorKey: 'debit',
    },
    {
        header: 'In (credit)',
        accessorKey: 'credit',
    },
    {
        header: 'Ballance',
        accessorKey: 'ballance',
    },
    {
        header: 'Category',
        accessorKey: 'assignedCategory',
        cell: (cell: any) => {
            const value = cell.renderValue() || 'unset'
            const marginTopBottom = 4
            return (
                <Select
                    value={value}
                    sx={{ borderWidth: value === 'unset' ? 4 : 1, width: '100%' }}
                    inputProps={{
                        style: { paddingTop: marginTopBottom, paddingBottom: marginTopBottom },
                    }}
                >
                    <MenuItem value={'unset'}>
                        - no category -
                    </MenuItem>
                    {categories?.map((category, idx) => (
                        <MenuItem
                            key={category.id}
                            onClick={callback ? () => callback(cell.row.index, category.id) : () => {}}
                            value={category.id}
                        >
                            {category.label}
                        </MenuItem>
                    ))}
                </Select>
            )
        }
    },
]

const initialValue: {
    state: TransactionEditState,
    dispatch: Dispatch<{ payload: any, type: string }>
} = {
    state: transactionEditInitialState,
    dispatch: () => {},
}

export const transactionEditReducer = (
    state: TransactionEditState,
    action: PayloadAction<any>,
) => {
    switch(action.type) {
        case TransactionEditActionTypes.setColumnMap:
            return {
                ...state,
                columnMap: action?.payload?.columnMap,
            }
        case TransactionEditActionTypes.updateCategory:
            return {
                ...state,
                transactions: state.transactions.map((transaction, idx) => {
                    if (idx === action?.payload?.idx) {
                        return {
                            ...transaction,
                            assignedCategory: action.payload.assignedCategory
                        }
                    }
                    return transaction
                })
            }
        case TransactionEditActionTypes.writeHeaders:
            return {
                ...state,
                headers: action?.payload?.headers,
            }
        case TransactionEditActionTypes.writeTransactions:
            return {
                ...state,
                transactions: action?.payload?.transactions,
            }
        default:
            return state;
    }
}

export const setColumnMap = (
    columnMap: TransactionEditState['columnMap'],
) => ({
    type: TransactionEditActionTypes.setColumnMap,
    payload: { columnMap }
})

export const updateCategory = (
    idx: number,
    assignedCategory: number,
) => ({
    type: TransactionEditActionTypes.updateCategory,
    payload: { idx, assignedCategory }
})

export const writeHeaders = (
    headers: TransactionEditState['headers'],
) => ({
    type: TransactionEditActionTypes.writeHeaders,
    payload: { headers }
})

export const writeTransactions = (
    transactions: TransactionEditState['transactions'],
) => ({
    type: TransactionEditActionTypes.writeTransactions,
    payload: { transactions }
})

export const TransactionEditContext = createContext(initialValue)