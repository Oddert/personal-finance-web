import { Matcher } from './Matcher';

/**
 * A single Category definition.
 * @category Global Types
 */
export declare interface Category {
    id: number;
    label: string;
    description: string;
    colour: string;
    created_on: string;
    updated_on: string;
    matchers: Matcher[];
}

/**
 * Represents a simplified category structure.
 *
 * Used on the category list component on Budget Breakdown.
 * @deprecated
 * @category Global Types
 */
export interface ICategoryBDValue {
    value: number;
    label: string;
    colour: string;
}

/**
 * A list of simplified category breakdown rows.
 *
 * Used on the category list component on Budget Breakdown.
 * @deprecated
 * @category Global Types
 */
export interface ICategoryBreakdown {
    [key: number | string]: ICategoryBDValue;
}
