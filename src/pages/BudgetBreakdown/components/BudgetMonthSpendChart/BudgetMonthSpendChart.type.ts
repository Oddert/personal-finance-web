import { Dayjs } from 'dayjs';

import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    filteredTransactions: Transaction[];
    endDate: Dayjs;
    startDate: Dayjs;
}

export interface IAgDataAccumulator {
    allCategories: {
        [categoryId: number]: {
            categoryId: number;
            categoryName: string;
            colour: string;
        };
    };
    categoriesByDate: {
        [year: number]: {
            [month: number]: {
                [categoryId: number | string]: {
                    categoryName: string;
                    colour: string;
                    value: number;
                };
            };
        };
    };
}

export interface IPivotAccumulator {
    [categoryId: number]: {
        name: string;
        data: { x: string; y: number }[];
    };
}

export interface ISPendChartCategory {
    categoryName: string;
    colour: string;
    value: number;
}

export interface ISPendChartMonth {
    [categoryId: number | string]: ISPendChartCategory;
}

export interface ISpendChartYear {
    [month: number]: ISPendChartMonth;
}
