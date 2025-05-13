import type { ICategory } from '../types/Category.d';
import type { IMatcher } from '../types/Matcher.d';

import { TransactionEditState } from '../contexts/transactionEditContext';

import { escapeRegex } from './commonUtils';

/**
 * Creates a RegExp instance from the Matcher format.
 * @param matcher The Matcher to be converted.
 * @returns The created expression.
 */
export const createRegexFromMatcher = (matcher: IMatcher) => {
    const prefix =
        matcher.match_type === 'exact' || matcher.match_type === 'start'
            ? '^'
            : '.*';
    const suffix =
        matcher.match_type === 'exact' || matcher.match_type === 'end'
            ? '$'
            : '.*';
    const location = matcher.match_type === 'any' ? 'g' : '';
    const capitalisation = matcher.case_sensitive ? '' : 'i';
    const matchString = `${prefix}${escapeRegex(matcher.match)}${suffix}`;
    const options = `${location}${capitalisation}`;
    const regexp = new RegExp(matchString, options);
    return regexp;
};

/**
 * Attempts to match categories to a list of partially-formatted matchers.
 * @param transactions List of read in CSV rows to be made into Transactions.
 * @param categories List of categories to attempt to match to.
 * @returns The list of transactions with categories matched (if matches are found).
 */
export const autoMatchCategories = (
    transactions: TransactionEditState['transactions'],
    categories: ICategory[],
) => {
    // Reduces the list of categories down to key-value pairs and a raw list of all `match` attributes.
    const regexList = categories.reduce(
        (
            acc: { all: string[]; withCategory: [RegExp, ICategory][] },
            category: ICategory,
        ) => {
            category?.matchers?.forEach((matcher) => {
                const re = createRegexFromMatcher(matcher);
                acc.all.push(matcher.match);
                acc.withCategory.push([re, category]);
            });
            return acc;
        },
        { all: [], withCategory: [] },
    );

    // The list of all `match` attributes is used to create a rough regex
    // This regex loosely matches any portion of the label in order to decide
    // whether or not to apply the matcher search which is more computationally expensive.
    const superMatcher = new RegExp(regexList.all.join('|'), 'gi');

    return transactions.map((transaction) => {
        const description: string =
            'Transaction Description' in transaction
                ? (transaction['Transaction Description'] as string)
                : (transaction.description as string);

        superMatcher.lastIndex = 0;
        // Test the label against the loose combined regex.
        if (superMatcher.test(description)) {
            // If the matcher is a possible match, compare it against the list of matchers.
            // Note: if multiple matchers are valid only the first is accepted.
            // It is the user's imperative to make sure the matchers make sense and avoid conflict.
            const result = regexList.withCategory.find((pair) => {
                pair[0].lastIndex = 0;
                if (pair[0].test(description)) {
                    return true;
                }
                return false;
            });
            if (result) {
                return {
                    ...transaction,
                    assignedCategory: result[1].id,
                };
            }
        }
        return transaction;
    });
};
