import type { TAggregateDataResponse } from '../../../../../../types/Transaction';

export interface IProps {
    clipPrefix: string;
    compact?: boolean;
    disableCategoryBreakdown?: boolean;
    loading?: boolean;
    pastData: TAggregateDataResponse;
    showNegatives?: boolean;
}
