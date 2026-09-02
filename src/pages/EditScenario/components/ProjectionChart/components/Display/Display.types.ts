import type { TAggregateDataResponse } from '../../../../../../types/Transaction';

export interface IProps {
    disableCategoryBreakdown?: boolean;
    loading?: boolean;
    pastData: TAggregateDataResponse;
    showNegatives?: boolean;
}
