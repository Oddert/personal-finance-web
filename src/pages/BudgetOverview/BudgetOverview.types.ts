import type { IBudgetDatum } from '../../types/Budget.types';
import type { Dayjs } from 'dayjs';

export interface IProps {}

export interface IBudgetOverviewChart {
    timestamp: Dayjs;
    data: IBudgetDatum[];
}
