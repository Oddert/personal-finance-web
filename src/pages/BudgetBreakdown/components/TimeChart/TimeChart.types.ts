import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    endDate: string;
    filteredTransactions: Transaction[];
    startDate: string;
}

export interface ISortedByCategoryRow {
    label: string;
    id: number;
    transactions: {
        [key: number]: Transaction[];
    };
}

export interface ISortedByCategory {
    [key: number]: ISortedByCategoryRow;
}
