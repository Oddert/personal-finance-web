import { Dayjs } from 'dayjs';

import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    categoryId: number;
    endDate: Dayjs;
    startDate: Dayjs;
}

export type TransactionExtended = Transaction & { outOfBounds: boolean };
