import { Dayjs } from 'dayjs';

import { IBudgetOverviewChart } from '../../BudgetOverview.types';

export interface IProps {
    chartList: IBudgetOverviewChart[];
    endDate: Dayjs;
    startDate: Dayjs;
}

export interface IAgDataAccumulator {
    [categoryId: number]: {
        name: string;
        data: { x: number; y: number }[];
    };
}
