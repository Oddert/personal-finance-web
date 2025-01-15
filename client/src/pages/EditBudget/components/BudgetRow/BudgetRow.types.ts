import { IBudgetRowEditable } from '../../EditBudget.types';

export interface IProps {
    budgetRows: IBudgetRowEditable[]
    budgetRow: IBudgetRowEditable
    setBudgetRows: (budgetRows: IBudgetRowEditable[]) => void
}
