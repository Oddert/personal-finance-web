import { Category } from '../types/Category';

import type { CategoryState } from '../redux/slices/categorySlice'

export const sortCategories = (categories: Category[]) => {
    const entries = Object.entries(categories)
    const orderedData = entries.reduce((
        accumulator: CategoryState['orderedData'],
        category,
    ) => {
        accumulator.byId[category[1].id] = category[1]
        accumulator.byLabel[category[1].label] = category[1]
        return accumulator
    }, {
        byId: {},
        byLabel: {},
    })
    return orderedData
}