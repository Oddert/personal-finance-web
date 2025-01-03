import { IBudget } from '../../Budget.types';

export interface IProps {
    monthBudget: IBudget
    setMonthBudget: (budget: IBudget) => void
}
