import type { IMatcher } from './Matcher.d';

/**
 * A single Category definition for transactions to be mapped to.
 *
 * Defined by the user, Categories are used to group transactions by type, purpose, budget plan, etc.
 * @category Types
 * @subcategory Category
 */
export interface ICategory {
    /** CSS colour string for some display elements. */
    colour: string;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** user-defined description of the Category and its purpose. */
    description: string | null;
    /** Unique identifier. */
    id: string;
    /** The main Category title. */
    label: string;
    /** List of Matchers to use to try to auto-map Transactions to this Category. */
    matchers: IMatcher[];
    /** ISO timestamp of most recent save. */
    updatedOn: string;
    /** ID of the user who owns this Category. */
    userId: string;
}

/**
 * Represents a simplified category structure.
 *
 * Used on the category list component on Budget Breakdown.
 * @category Types
 * @subcategory Category
 */
export interface ICategoryBDValue {
    value: number;
    label: string;
    colour: string;
}

/**
 * A list of simplified category breakdown rows used on the Budget Breakdown page only.
 *
 * Used on the category list component on Budget Breakdown.
 * @category Types
 * @subcategory Category
 */
export type ICategoryBreakdown = Record<number | string, ICategoryBDValue>;
