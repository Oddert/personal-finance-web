import { createContext, Dispatch } from 'react';

// import type { Transaction } from '../types/Transaction'
import { PayloadAction } from '@reduxjs/toolkit';

interface TransactionEditState {
    columnMap: { [key: string]: string }
    transactions: { [key: string]: string }[]
    headers: string[]
}

const TransactionEditActionTypes = {
    setColumnMap: 'setColumnMap',
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

export const defaultColumns = [
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