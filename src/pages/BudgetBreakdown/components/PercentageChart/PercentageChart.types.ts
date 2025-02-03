import { Dayjs } from 'dayjs';

import { IBudgetDatum } from '../../../../types/Budget.types';

export interface IProps {
    data: IBudgetDatum[];
    endDate: Dayjs;
    startDate: Dayjs;
}
