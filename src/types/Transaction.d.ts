import { Category } from './Category.d';

/**
 * A single transaction.
 * @category Global Types
 */
export declare interface Transaction {
    ballance: number;
    cardId: number | null;
    categoryId: number | null;
    createdOn: string;
    credit: number;
    currency: string | null;
    date: number;
    debit: number;
    description: string;
    id: number;
    transactionType: string;
    updatedOn: string;
    assignedCategory?: Category;
}

export type TTransactionKeys =
    | 'assignedCategory'
    | 'ballance'
    | 'cardId'
    | 'categoryId'
    | 'credit'
    | 'currency'
    | 'date'
    | 'debit'
    | 'description'
    | 'transactionType';
