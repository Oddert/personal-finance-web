import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    categoryId: number;
    endDate: string;
    startDate: string;
}

export type TransactionExtended = Transaction & { outOfBounds: boolean };
