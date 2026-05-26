import type { TAggregateDatapoints } from '../../../../../../types/Transaction';

export interface IProps {
    disableCategoryBreakdown?: boolean;
    loading?: boolean;
    pastData: TAggregateDatapoints;
    showNegatives?: boolean;
}
