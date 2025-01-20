import { IBudget, IBudgetDatum } from '../../../../types/Budget.types';

export interface IProps {
    data: IBudgetDatum[];
    monthBudget: IBudget | null;
    numMonths: number;
}
