import { MatchType } from '../types/Matcher';

export const matchTypesOptions: { label: string, value: MatchType }[] = [
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
]
