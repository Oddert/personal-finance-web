import { IBudgetOverviewChart } from '../../../../BudgetOverview.types';

export interface IProps {
    monthData: IBudgetOverviewChart;
    useFloat: boolean;
    zoomDim: {
        height: number;
        width: number;
    };
}
