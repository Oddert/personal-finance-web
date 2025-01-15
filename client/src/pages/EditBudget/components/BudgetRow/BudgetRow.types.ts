import { IBudgetRowEditable } from '../../EditBudget.types';

export interface IProps {
    budgetDatums: IBudgetRowEditable[]
    budgetRow: IBudgetRowEditable
    setBudgetDatums: (budgetRows: IBudgetRowEditable[]) => void
}
