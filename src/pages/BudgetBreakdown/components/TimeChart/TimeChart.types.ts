import type { ITransaction } from '../../../../types/Transaction.d';
import type { Dayjs } from 'dayjs';

export interface IProps {
    endDate: Dayjs;
    filteredTransactions: ITransaction[];
    startDate: Dayjs;
}

export interface ISortedByCategoryRow {
    label: string;
    id: string;
    transactions: Record<string, ITransaction[]>;
}

export type ISortedByCategory = Record<string, ISortedByCategoryRow>;
