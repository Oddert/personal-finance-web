import { Dayjs } from 'dayjs';

import type { IBudgetOverviewChart } from '../../BudgetOverview.types';

export interface IProps {
    chartList: IBudgetOverviewChart[];
    endDate: Dayjs;
    showFullDateRange: boolean;
    startDate: Dayjs;
}

export type IAgDataAccumulator = Record<
    string,
    {
        name: string;
        data: { x: number; y: number }[];
    }
>;
