import { IBudget } from '../../../../types/Budget.types';

import { IBudgetDatum } from '../../BudgetBreakdown.types';

export interface IProps {
    data: IBudgetDatum[]
    monthBudget: IBudget|null
	numMonths: number
}
