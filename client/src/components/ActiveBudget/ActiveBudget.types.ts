import { IBudget } from '../../types/Budget.types';

export interface IProps {
    monthBudget: IBudget
    setMonthBudget: (budget: IBudget) => void
}
