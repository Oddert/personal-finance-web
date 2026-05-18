import type { ICategory } from './Category.d';

/**
 * A single transaction.
 * @category Global Types
 */
export declare interface ITransaction {
    ballance: number;
    cardId: string | null;
    categoryId: string | null;
    createdOn: string;
    credit: number;
    currency: string | null;
    date: number;
    debit: number;
    description: string;
    id: string;
    transactionType: string;
    updatedOn: string;
    assignedCategory?: ICategory;
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

export interface IAggregateDatapoint {
    categoryId: string;
    month: Date;
    totalCredit: number;
    totalDebit: number;
    categoryName: string;
}

export type TAggregateDatapoints = Record<string, IAggregateDatapoint[]>;
