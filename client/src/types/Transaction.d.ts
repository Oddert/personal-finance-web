import { Category } from './Category';

/**
 * A single transaction.
 * @category Global Types
 */
export declare interface Transaction {
    ballance: number;
    category_id: number | null;
    created_on: string;
    credit: number;
    date: number;
    debit: number;
    description: string;
    id: number;
    transaction_type: string;
    updated_on: string;
    assignedCategory?: Category;
}
