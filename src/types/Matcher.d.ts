/**
 * Allowed string values for Matcher.
 * @category Types
 * @subcategory Matcher
 */
export type TMatchType = 'exact' | 'start' | 'end' | 'any';

/**
 * A Matcher, used to auto-match Categories to Transactions.
 * @category Types
 * @subcategory Matcher
 */
export interface IMatcher {
    /** If true, the match should match case, ignore otherwise. */
    caseSensitive: boolean;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** Unique identifier. */
    id: string;
    /** User-defined string to match using. */
    match: string;
    /** The type of match to use. Maps to regular expression logic. */
    matchType: TClientMatchType;
    /** ISO timestamp of most recent save. */
    updatedOn: string;
    /** ID of the user who owns this Category. */
    userId: string;
}
