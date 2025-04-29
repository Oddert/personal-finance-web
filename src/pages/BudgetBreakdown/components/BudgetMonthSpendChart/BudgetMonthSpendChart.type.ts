import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    filteredTransactions: Transaction[];
}

export interface IMonthSpendCategory {
    categoryId: number;
    categoryName: string;
    colour: string;
}

export interface IAllCategories {
    [categoryId: number]: IMonthSpendCategory;
}

export interface IAgDataAccumulator {
    allCategories: IAllCategories;
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

export interface ISeries {
    categoryId: number;
    name: string;
    data: { x: string; y: number }[];
}

export interface IPivotAccumulator {
    [categoryId: number]: ISeries;
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
