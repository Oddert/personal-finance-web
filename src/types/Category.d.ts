import { IMatcher } from './Matcher.d';

/**
 * A single Category definition.
 * @category Global Types
 */
export declare interface ICategory {
    id: string;
    label: string;
    description: string;
    colour: string;
    created_on: string;
    updated_on: string;
    matchers: IMatcher[];
}

/**
 * Represents a simplified category structure.
 *
 * Used on the category list component on Budget Breakdown.
 * @category Global Types
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
 * @category Global Types
 */
export interface ICategoryBreakdown {
    [key: number | string]: ICategoryBDValue;
}
