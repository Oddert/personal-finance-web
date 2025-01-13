import { IBudgetDatum } from '../../BudgetBreakdown.types';

export interface IProps {
	data: IBudgetDatum[]
	endDate: string
	startDate: string
}
