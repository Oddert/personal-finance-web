import type { ICategory } from './Category.d';

/**
 * A single historical transaction representing an action occurring on an account / card.
 * @category Types
 * @subcategory Transaction
 */
export interface ITransaction {
    /** The ballance at after the current transaction. */
    ballance: number;
    /** Card / account the transaction belongs to. */
    cardId: string | null;
    /** Category the transaction is assigned to. */
    categoryId: string | null;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** Cash flow into the account with this transaction. */
    credit: number;
    /** The ISO currency code. */
    currency: string | null;
    /** ISO timestamp when this transaction occurred. */
    date: number;
    /** Cash flow out of the account with this transaction. */
    debit: number;
    /** Short description or seller code. */
    description: string;
    /** Unique identifier. */
    id: string;
    /** What type the transaction is. */
    transactionType: string;
    /** ISO timestamp of most recent save. */
    updatedOn: string;
    /** The joined category associated. Only supplied on certain endpoints as requested. */
    assignedCategory?: ICategory;
}

export type TTransactionKeys = keyof ITransaction;

export interface IAggregateDatapoint {
    categoryId: string;
    month: Date;
    totalCredit: number;
    totalDebit: number;
    categoryName: string;
}

export type TAggregateDatapoints = Record<
    string,
    {
        data: IAggregateDatapoint[];
        totalCredit: number;
        totalDebit: number;
        finalBalance?: number;
    }
>;

export type TAggregateDataResponse = {
    cardId: string;
    transactions: TAggregateDatapoints;
}[];
