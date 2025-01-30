import { createContext, Dispatch } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';

import { Autocomplete, TextField } from '@mui/material';

import type { Category } from '../types/Category.d';

export interface TransactionEditState {
    columnMap: { [key: string]: string };
    headers: string[];
    match?: string;
    sideBarOpen: boolean;
    transactions: { [key: string]: string | number | null }[];
    mode: 'upload' | 'edit';
    loading: boolean;
}

const TransactionEditActionTypes = {
    changeSelected: 'changeSelected',
    checkAll: 'checkAll',
    setColumnMap: 'setColumnMap',
    setMode: 'setMode',
    setLoading: 'setLoading',
    toggleSideBarOpen: 'toggleSideBarOpen',
    uncheckAll: 'uncheckAll',
    updateDescription: 'updateDescription',
    updateCategory: 'updateCategory',
    writeHeaders: 'writeHeaders',
    writeTransactions: 'writeTransactions',
};

export const transactionEditInitialState: TransactionEditState = {
    columnMap: {
        date: 'Transaction Date',
        transactionType: 'Transaction Type',
        description: 'Transaction Description',
        debit: 'Debit Amount',
        credit: 'Credit Amount',
        ballance: 'Balance',
    },
    loading: false,
    headers: [],
    mode: 'upload',
    sideBarOpen: false,
    transactions: [],
};

// TODO: remove react-table logic once new logic is confirmed stable and better.
export const defaultColumns = (
    categories?: { [id: string]: Category },
    callback?: (idx: number, assignedCategory: number) => void,
) => [
    {
        header: 'Selected',
        accessorKey: 'selected',
    },
    {
        header: 'Date',
        accessorKey: 'date',
    },
    {
        header: 'Description',
        accessorKey: 'description',
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
            if (!categories || !callback) {
                return;
            }
            const value = cell.renderValue() || 'unset';
            const marginTopBottom = '4px';
            return (
                // <select
                //     onChange={(e) => {
                //         if (!e.currentTarget.value) {
                //             return
                //         }
                //         callback(cell.row.index, Number(e.currentTarget.value))
                //     }}
                //     // value={categories[value].id || undefined}
                // >
                //     <option value={'unset'}>
                //         - none -
                //     </option>
                //     {Object.entries(categories).map(([key, category]) => (
                //         <option value={category.id}>
                //             {category.label}
                //         </option>
                //     ))}
                // </select>
                <Autocomplete
                    autoHighlight
                    disablePortal
                    onChange={(event, category) => {
                        if (!category) {
                            return;
                        }
                        callback(cell.row.index, category.id);
                    }}
                    options={Object.values(
                        categories as { [id: string]: Category },
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Category'
                            placeholder='unset'
                            sx={{
                                paddingTop: marginTopBottom,
                                paddingBottom: marginTopBottom,
                            }}
                        />
                    )}
                    sx={{
                        borderWidth: value === 'unset' ? 4 : 1,
                        width: '100%',
                        padding: '4px',
                    }}
                    value={categories[value] || null}
                />
            );
        },
    },
];

const initialValue: {
    state: TransactionEditState;
    dispatch: Dispatch<{ payload: any; type: string }>;
} = {
    state: transactionEditInitialState,
    dispatch: () => {},
};

export const transactionEditReducer = (
    state: TransactionEditState,
    action: PayloadAction<any>,
) => {
    console.log(action);
    switch (action.type) {
        case TransactionEditActionTypes.changeSelected:
            return {
                ...state,
                transactions: [
                    ...state.transactions.slice(0, action.payload.idx),
                    {
                        ...state.transactions[action.payload.idx],
                        selected: action?.payload?.selected,
                    },
                    ...state.transactions.slice(action.payload.idx + 1),
                ],
            };
        case TransactionEditActionTypes.checkAll:
            return {
                ...state,
                transactions: state.transactions.map((transaction) => ({
                    ...transaction,
                    selected: true,
                })),
            };
        case TransactionEditActionTypes.setColumnMap:
            return {
                ...state,
                columnMap: action?.payload?.columnMap,
            };
        case TransactionEditActionTypes.setLoading:
            return {
                ...state,
                loading: action?.payload?.loading,
            };
        case TransactionEditActionTypes.setMode:
            return {
                ...state,
                mode: action?.payload?.mode,
            };
        case TransactionEditActionTypes.toggleSideBarOpen:
            return {
                ...state,
                sideBarOpen:
                    action?.payload?.open === 'undefined'
                        ? !state.sideBarOpen
                        : action?.payload?.open,
                match: action?.payload?.match,
            };
        case TransactionEditActionTypes.uncheckAll:
            return {
                ...state,
                transactions: state.transactions.map((transaction) => ({
                    ...transaction,
                    selected: false,
                })),
            };
        case TransactionEditActionTypes.updateDescription:
            return {
                ...state,
                transactions: [
                    ...state.transactions.slice(0, action.payload.idx),
                    {
                        ...state.transactions[action.payload.idx],
                        [state.columnMap.description]:
                            action?.payload?.description,
                    },
                    ...state.transactions.slice(action.payload.idx + 1),
                ],
            };
        case TransactionEditActionTypes.updateCategory:
            if (
                action.payload.idx === null ||
                !action?.payload?.assignedCategory
            ) {
                return state;
            }
            const transactions: TransactionEditState['transactions'] = [
                ...state.transactions.slice(0, action.payload.idx),
                {
                    ...state.transactions[action.payload.idx],
                    assignedCategory: action.payload.assignedCategory,
                },
                ...state.transactions.slice(action.payload.idx + 1),
            ];

            return {
                ...state,
                transactions,
            };
        case TransactionEditActionTypes.writeHeaders:
            return {
                ...state,
                headers: action?.payload?.headers,
            };
        case TransactionEditActionTypes.writeTransactions:
            return {
                ...state,
                transactions: action?.payload?.transactions,
            };
        default:
            return state;
    }
};

export const changeSingleSelected = (idx: number, selected: boolean) => ({
    type: TransactionEditActionTypes.changeSelected,
    payload: { idx, selected },
});

export const checkAll = () => ({
    type: TransactionEditActionTypes.checkAll,
    payload: {},
});

export const setColumnMap = (columnMap: TransactionEditState['columnMap']) => ({
    type: TransactionEditActionTypes.setColumnMap,
    payload: { columnMap },
});

export const setLoading = (loading: TransactionEditState['loading']) => ({
    type: TransactionEditActionTypes.setLoading,
    payload: { loading },
});

export const setMode = (mode: TransactionEditState['mode']) => ({
    type: TransactionEditActionTypes.setMode,
    payload: { mode },
});

export const toggleSideBar = (
    open?: TransactionEditState['sideBarOpen'],
    match?: string,
) => ({
    type: TransactionEditActionTypes.toggleSideBarOpen,
    payload: { open, match },
});

export const uncheckAll = () => ({
    type: TransactionEditActionTypes.uncheckAll,
    payload: {},
});

export const updateDescription = (idx: number, description: string) => ({
    type: TransactionEditActionTypes.updateDescription,
    payload: { idx, description },
});

export const updateCategory = (idx: number, assignedCategory: number) => ({
    type: TransactionEditActionTypes.updateCategory,
    payload: { idx, assignedCategory },
});

export const writeHeaders = (headers: TransactionEditState['headers']) => ({
    type: TransactionEditActionTypes.writeHeaders,
    payload: { headers },
});

export const writeTransactions = (
    transactions: TransactionEditState['transactions'],
) => ({
    type: TransactionEditActionTypes.writeTransactions,
    payload: { transactions },
});

export const TransactionEditContext = createContext(initialValue);
