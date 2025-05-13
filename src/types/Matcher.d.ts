/**
 * Allowed string values for Matcher.
 * @category Global Types
 */
export declare type TMatchType = 'exact' | 'start' | 'end' | 'any';

/**
 * A Matcher, used to auto-match Categories to Transactions.
 * @category Global Types
 */
export declare interface IMatcher {
    id: string;
    match: string;
    match_type: MatchType;
    case_sensitive: boolean | 1 | 0;
    created_on: string;
    updated_on: string;
}
