import type { IBudgetDatum } from '../../../../types/Budget.types';
import type { Dayjs } from 'dayjs';

export interface IProps {
    data: IBudgetDatum[];
    endDate: Dayjs;
    startDate: Dayjs;
}
