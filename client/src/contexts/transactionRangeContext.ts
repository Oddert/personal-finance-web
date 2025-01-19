import { PayloadAction } from '@reduxjs/toolkit';
import { createContext, Dispatch } from 'react';

export interface TransactionRangeState {
    rangeKeys: {
        [index: number]: string;
    };
    rangeValues: {
        [index: number]: {
            top: number;
            bottom: number;
        };
    };
    rangeLength: number;
    value: [number, number];
    marks: { label: string; value: number }[];
}

const TransactionRangeActionTypes = {
    setRangeKeys: 'setRangeKeys',
    setRangeValues: 'setRangeValues',
    updateValue: 'updateValue',
};

export const initialState: TransactionRangeState = {
    rangeKeys: {},
    rangeValues: {},
    rangeLength: 0,
    value: [0, 0],
    marks: [],
};

export const transactionRangeReducer = (
    state: TransactionRangeState,
    action: PayloadAction<any>,
) => {
    console.log(action);
    switch (action.type) {
        case TransactionRangeActionTypes.setRangeKeys:
            return {
                ...state,
                rangeKeys: action?.payload?.rangeKeys,
                rangeLength: action?.payload?.length,
                marks: action?.payload?.marks,
            };
        case TransactionRangeActionTypes.setRangeValues:
            return {
                ...state,
                rangeValues: action?.payload?.rangeValues,
            };
        case TransactionRangeActionTypes.updateValue:
            return {
                ...state,
                value: action?.payload?.value,
            };
        default:
            return state;
    }
};

export const setRangeKeys = (
    rangeKeys: TransactionRangeState['rangeKeys'],
    length: number,
    marks: { value: number; label: string }[],
) => ({
    type: TransactionRangeActionTypes.setRangeKeys,
    payload: { rangeKeys, length, marks },
});

export const setRangeValues = (
    rangeValues: TransactionRangeState['rangeValues'],
) => ({
    type: TransactionRangeActionTypes.setRangeValues,
    payload: { rangeValues },
});

export const updateValue = (value: TransactionRangeState['value']) => ({
    type: TransactionRangeActionTypes.updateValue,
    payload: { value },
});

const initialValue: {
    state: typeof initialState;
    dispatch: Dispatch<{ payload: any; type: string }>;
} = {
    state: initialState,
    dispatch: () => {},
};

export const TransactionRange = createContext(initialValue);
