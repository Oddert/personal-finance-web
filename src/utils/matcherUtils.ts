import type { MatchType } from '../types/Matcher';

/**
 * List of options for a match-type selector on the Matcher edit and create forms.
 */
export const matchTypesOptions: { label: string; value: MatchType }[] = [
    {
        label: 'Any',
        value: 'any',
    },
    {
        label: 'Exact',
        value: 'exact',
    },
    {
        label: 'Start',
        value: 'start',
    },
    {
        label: 'End',
        value: 'end',
    },
];
