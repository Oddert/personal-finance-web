import { Transaction } from '../../../../types/Transaction';

export interface IProps {
    endDate: string
    filteredTransactions: Transaction[]
    startDate: string
}
