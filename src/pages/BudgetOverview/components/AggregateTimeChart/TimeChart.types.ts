import { Dayjs } from 'dayjs';

import type { IBudgetOverviewChart } from '../../BudgetOverview.types';

export interface IProps {
    chartList: IBudgetOverviewChart[];
    endDate: Dayjs;
    showFullDateRange: boolean;
    startDate: Dayjs;
}
