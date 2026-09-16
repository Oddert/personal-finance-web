import type { ICategory } from './Category.d';

/**
 * A single historical transaction representing an action occurring on an account / card.
 * @category Types
 * @subcategory Transaction
 */
export interface ITransaction {
    /** The joined category associated. Only supplied on certain endpoints as requested. */
    assignedCategory?: ICategory;
    /** The ballance at after the current transaction. */
    ballance: number;
    /** Card / account the transaction belongs to. */
    cardId: string;
    /** Category the transaction is assigned to. */
    categoryId: string | null;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** Cash flow into the account with this transaction. */
    credit: number;
    /** The ISO currency code. */
    currency: string | null;
    /** ISO timestamp when this transaction occurred. */
    date: string;
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
    /** ID of the user who owns his transaction. */
    userId: string;
}

export type TTransactionKeys = keyof ITransaction;

/**
 * Represents an individual aggregated record.
 *
 * In 'category' mode this is a month's values. In 'time' mode this represents a category's value.
 */
export interface IAggregateDatapoint {
    categoryId: string;
    month: Date;
    totalCredit: number;
    totalDebit: number;
    categoryName: string;
}

/**
 * Collects a series of category or month aggregations (depending on mode) and appends some totals values.
 */
export interface IAggregateDatapointRecord {
    data: IAggregateDatapoint[];
    totalCredit: number;
    totalDebit: number;
    finalBalance?: number;
}

/**
 * Key is either a category ID (in 'category' mode) or a time period code (in 'time' mode) in the format YYYY-MM, e.g. 2026-04.
 */
export type TAggregateDatapoints = Record<string, IAggregateDatapointRecord>;

/**
 * The entire aggregation for a single card.
 */
export type TAggregateDataResponse = {
    cardId: string;
    transactions: TAggregateDatapoints;
}[];
