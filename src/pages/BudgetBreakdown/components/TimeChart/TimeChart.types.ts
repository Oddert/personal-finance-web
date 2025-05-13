import { Dayjs } from 'dayjs';

import type { ITransaction } from '../../../../types/Transaction.d';

export interface IProps {
    endDate: Dayjs;
    filteredTransactions: ITransaction[];
    startDate: Dayjs;
}

export interface ISortedByCategoryRow {
    label: string;
    id: string;
    transactions: {
        [key: string]: ITransaction[];
    };
}

export interface ISortedByCategory {
    [key: string]: ISortedByCategoryRow;
}
