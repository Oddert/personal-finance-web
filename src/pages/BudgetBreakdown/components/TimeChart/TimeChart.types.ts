import { Dayjs } from 'dayjs';

import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    endDate: Dayjs;
    filteredTransactions: Transaction[];
    startDate: Dayjs;
}

export interface ISortedByCategoryRow {
    label: string;
    id: string;
    transactions: {
        [key: string]: Transaction[];
    };
}

export interface ISortedByCategory {
    [key: string]: ISortedByCategoryRow;
}
