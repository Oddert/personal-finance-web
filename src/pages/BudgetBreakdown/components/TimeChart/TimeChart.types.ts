import { Dayjs } from 'dayjs';

import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    endDate: Dayjs;
    filteredTransactions: Transaction[];
    startDate: Dayjs;
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
