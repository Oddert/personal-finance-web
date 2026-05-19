import type { IBudgetOverviewChart } from '../../BudgetOverview.types';
import type { Dayjs } from 'dayjs';

export interface IProps {
    chartList: IBudgetOverviewChart[];
    endDate: Dayjs;
    showFullDateRange: boolean;
    startDate: Dayjs;
}
