import type { TAggregateDatapoints } from '../../../../../../types/Transaction';

export interface IProps {
    loading?: boolean;
    pastData: TAggregateDatapoints;
    showNegatives?: boolean;
}
