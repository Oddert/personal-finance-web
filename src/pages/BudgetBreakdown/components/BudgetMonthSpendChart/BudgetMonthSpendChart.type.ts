import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    filteredTransactions: Transaction[];
}

export interface IMonthSpendCategory {
    categoryId: string;
    categoryName: string;
    colour: string;
}

export interface IAllCategories {
    [categoryId: string]: IMonthSpendCategory;
}

export interface IAgDataAccumulator {
    allCategories: IAllCategories;
    categoriesByDate: {
        [year: number]: {
            [month: number]: {
                [categoryId: string]: {
                    categoryName: string;
                    colour: string;
                    value: number;
                };
            };
        };
    };
}

export interface ISeries {
    categoryId: string;
    name: string;
    data: { x: string; y: number }[];
}

export interface IPivotAccumulator {
    [categoryId: string]: ISeries;
}

export interface ISPendChartCategory {
    categoryName: string;
    colour: string;
    value: number;
}

export interface ISPendChartMonth {
    [categoryId: string]: ISPendChartCategory;
}

export interface ISpendChartYear {
    [month: number]: ISPendChartMonth;
}
