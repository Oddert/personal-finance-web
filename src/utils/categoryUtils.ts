import { Category } from '../types/Category.d';

import type { CategoryState } from '../redux/slices/categorySlice';

/**
 * Sorts a list of categories into lookup objects by ID and label.
 * @param categories The Categories to sort.
 * @returns The Categories sorted by ID and label.
 */
export const sortCategories = (categories: Category[]) => {
    const values = Object.values(categories);
    const orderedData = values.reduce(
        (accumulator: CategoryState['orderedData'], category) => {
            accumulator.byId[category.id] = category;
            accumulator.byLabel[category.label] = category;
            return accumulator;
        },
        {
            byId: {},
            byLabel: {},
        },
    );
    return orderedData;
};
