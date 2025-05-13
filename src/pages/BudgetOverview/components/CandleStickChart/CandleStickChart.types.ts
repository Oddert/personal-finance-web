import { Dayjs } from 'dayjs';

import type { ITransaction } from '../../../../types/Transaction.d';

export interface IProps {
    endDate: Dayjs;
    startDate: Dayjs;
    transactions: {
        [year: string]: {
            [month: number]: ITransaction[];
        };
    };
}
