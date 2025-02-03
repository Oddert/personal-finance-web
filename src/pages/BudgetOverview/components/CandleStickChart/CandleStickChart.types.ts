import { Dayjs } from 'dayjs';

import { Transaction } from '../../../../types/Transaction.d';

export interface IProps {
    endDate: Dayjs;
    startDate: Dayjs;
    transactions: {
        [year: string]: {
            [month: number]: Transaction[];
        };
    };
}
