import { Dayjs } from 'dayjs';

import type { ITransaction } from '../../../../types/Transaction.d';

export interface IProps {
    categoryId: string;
    endDate: Dayjs;
    startDate: Dayjs;
}

export type ITransactionExtended = ITransaction & { outOfBounds: boolean };
