import { IBudget } from '../../pages/Budget/Budget.types';

export interface IProps {
    monthBudget: IBudget
    setMonthBudget: (budget: IBudget) => void
}
