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
    date: number;
    debit: number;
    description: string;
    id: number;
    transactionType: string;
    updatedOn: string;
    assignedCategory?: Category;
}
