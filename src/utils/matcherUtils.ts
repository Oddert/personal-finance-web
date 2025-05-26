import type { TMatchType } from '../types/Matcher.d';

/**
 * List of options for a match-type selector on the Matcher edit and create forms.
 */
export const matchTypesOptions: { label: string; value: TMatchType }[] = [
    {
        label: 'Category.matchTypes.Any',
        value: 'any',
    },
    {
        label: 'Category.matchTypes.Exact',
        value: 'exact',
    },
    {
        label: 'Category.matchTypes.Start',
        value: 'start',
    },
    {
        label: 'Category.matchTypes.End',
        value: 'end',
    },
];
