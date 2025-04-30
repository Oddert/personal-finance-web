import { createContext, Dispatch } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';

export interface ITECTransaction {
    [key: string]: string | number | null;
}

export interface TransactionEditState {
    columnMap: { [key: string]: string };
    headers: string[];
    match?: string;
    sideBarOpen: boolean;
    transactions: ITECTransaction[];
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
    updateNumericValue: 'updateNumericValue',
    writeHeaders: 'writeHeaders',
    tecWriteTransactions: 'tecWriteTransactions',
};

export const transactionEditInitialState: TransactionEditState = {
    columnMap: {
        date: 'date',
        transactionType: 'transactionType',
        description: 'description',
        debit: 'debit',
        credit: 'credit',
        ballance: 'ballance',
        currency: 'currency',
    },
    loading: false,
    headers: [],
    mode: 'upload',
    sideBarOpen: false,
    transactions: [],
};

export type TAccessorKey =
    | 'selected'
    | 'date'
    | 'description'
    | 'debit'
    | 'credit'
    | 'ballance'
    | 'assignedCategory'
    | 'currency';

export type TAccessorKeyNumbers = 'debit' | 'credit' | 'ballance';

export interface IColumnDef {
    header: string;
    accessorKey: TAccessorKey;
}

// TODO: remove react-table logic once new logic is confirmed stable and better.
export const defaultColumns: IColumnDef[] = [
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
        header: 'Currency',
        accessorKey: 'currency',
    },
    {
        header: 'Category',
        accessorKey: 'assignedCategory',
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
                transactions: state.transactions.map((transaction) =>
                    transaction.tecTempId === action.payload.uid
                        ? { ...transaction, selected: action.payload.selected }
                        : transaction,
                ),
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
                transactions: state.transactions.map((transaction) =>
                    transaction.tecTempId === action.payload.uid
                        ? {
                              ...transaction,
                              [state.columnMap.description]:
                                  action.payload.description,
                          }
                        : transaction,
                ),
            };
        case TransactionEditActionTypes.updateCategory:
            return {
                ...state,
                transactions: state.transactions.map((transaction) =>
                    transaction.tecTempId === action.payload.uid
                        ? {
                              ...transaction,
                              assignedCategory: action.payload.assignedCategory,
                          }
                        : transaction,
                ),
            };
        case TransactionEditActionTypes.updateNumericValue:
            return {
                ...state,
                transactions: state.transactions.map((transaction) =>
                    transaction.tecTempId === action.payload.uid
                        ? {
                              ...transaction,
                              [state.columnMap[action.payload.field]]:
                                  action.payload.value,
                          }
                        : transaction,
                ),
            };
        case TransactionEditActionTypes.writeHeaders:
            return {
                ...state,
                headers: action?.payload?.headers,
            };
        case TransactionEditActionTypes.tecWriteTransactions:
            return {
                ...state,
                transactions: action?.payload?.transactions,
            };
        default:
            return state;
    }
};

export const changeSingleSelected = (uid: string, selected: boolean) => ({
    type: TransactionEditActionTypes.changeSelected,
    payload: { uid, selected },
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

export const updateCategory = (uid: string, assignedCategory: number) => ({
    type: TransactionEditActionTypes.updateCategory,
    payload: { uid, assignedCategory },
});

export const updateDescription = (uid: string, description: string) => ({
    type: TransactionEditActionTypes.updateDescription,
    payload: { uid, description },
});

export const updateNumericValue = (
    uid: string,
    field: TAccessorKeyNumbers,
    value: string,
) => ({
    type: TransactionEditActionTypes.updateNumericValue,
    payload: { uid, field, value },
});

export const writeHeaders = (headers: TransactionEditState['headers']) => ({
    type: TransactionEditActionTypes.writeHeaders,
    payload: { headers },
});

export const tecWriteTransactions = (
    transactions: TransactionEditState['transactions'],
) => ({
    type: TransactionEditActionTypes.tecWriteTransactions,
    payload: { transactions },
});

export const TransactionEditContext = createContext(initialValue);
