import type { ICategory } from '../types/Category.d';

import { autoMatchCategories } from './uploadUtils';

const category = (match: string): ICategory => ({
    colour: '#000000',
    createdOn: '',
    description: null,
    id: 'category-id',
    label: 'Category',
    matchers: [
        {
            caseSensitive: false,
            id: 'matcher-id',
            match,
            matchType: 'any',
            createdOn: '',
            updatedOn: '',
            userId: '',
        },
    ],
    updatedOn: '',
    userId: 'user-id',
});

describe('autoMatchCategories', () => {
    it('recalculates assignments and clears unmatched transactions', () => {
        const transactions = [
            {
                description: 'Coffee shop',
                assignedCategory: 'old-category',
            },
            {
                description: 'Rent',
                assignedCategory: 'category-id',
            },
        ];

        expect(
            autoMatchCategories(transactions, [category('Coffee')], {}, true),
        ).toEqual([
            {
                description: 'Coffee shop',
                assignedCategory: 'category-id',
            },
            {
                description: 'Rent',
                assignedCategory: '',
            },
        ]);
    });

    it('preserves unmatched assignments during normal upload matching', () => {
        const transactions = [
            {
                description: 'Rent',
                assignedCategory: 'existing-category',
            },
        ];

        expect(
            autoMatchCategories(transactions, [category('Coffee')], {}),
        ).toEqual(transactions);
    });
});
