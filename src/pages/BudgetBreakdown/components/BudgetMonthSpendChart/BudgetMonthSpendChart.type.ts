import type { ITransaction } from '../../../../types/Transaction.d';

export interface IProps {
    filteredTransactions: ITransaction[];
}

export interface IMonthSpendCategory {
    categoryId: string;
    categoryName: string;
    colour: string;
}

export type IAllCategories = Record<string, IMonthSpendCategory>;

export interface IAgDataAccumulator {
    allCategories: IAllCategories;
    categoriesByDate: Record<
        number,
        Record<
            number,
            Record<
                string,
                {
                    categoryName: string;
                    colour: string;
                    value: number;
                }
            >
        >
    >;
}

export interface ISeries {
    categoryId: string;
    name: string;
    data: { x: string; y: number }[];
}

export type IPivotAccumulator = Record<string, ISeries>;

export interface ISPendChartCategory {
    categoryName: string;
    colour: string;
    value: number;
}

export type ISPendChartMonth = Record<string, ISPendChartCategory>;

export type ISpendChartYear = Record<number, ISPendChartMonth>;
