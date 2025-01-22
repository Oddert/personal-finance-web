import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { IBudget, IBudgetDatum } from '../types/Budget.types';
import type { ICategoryBreakdown } from '../types/Category.d';
import type { Transaction } from '../types/Transaction.d';

import { CategoryState } from '../redux/slices/categorySlice';

import { normaliseNum } from './mathsUtils';

dayjs.extend(localizedFormat);

export const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Given a date in any string format parsable by dayjs.
 *
 * Returns the first day of that month in format YYYY-MM-DD.
 * @param rawDate The date to be flattened.
 * @returns The new date string in standard format.
 */
export const toBeginningMonth = (rawDate: string | Date | Dayjs) => {
    const date = dayjs(rawDate).startOf('month');
    return date.format(DATE_FORMAT);
};

/**
 * Given a date in any string format parsable by dayjs.
 *
 * Returns the last day of that month in format YYYY-MM-DD.
 * @param rawDate The date to be ceilinged.
 * @returns The new date string in standard format.
 */
export const toEndMonth = (rawDate: string | Date | Dayjs) => {
    const date = dayjs(rawDate).endOf('month');
    return date.format(DATE_FORMAT);
};

/**
 * Given a DayJs instance, returns a new instance set to the beginning of the month.
 * @param rawDate The date to be flattened.
 * @returns The new date string in standard format.
 */
export const toBeginningMonthDayjs = (rawDate: string | Date | Dayjs) => {
    const date = dayjs(rawDate).startOf('month');
    return date;
};

/**
 * Given a DayJs instance, returns a new instance set to the end date of the month.
 * @param rawDate The date to be ceilinged.
 * @returns The new date string in standard format.
 */
export const toEndMonthDayjs = (rawDate: string | Date | Dayjs) => {
    const date = dayjs(rawDate).endOf('month');
    return date;
};

/**
 * Sorts transactions into an ordered structure by category.
 *
 * Category datums also contain basic category information for ease of use.
 * @param transactions The list of transactions in the current view.
 * @param categoriesOrderedById The ordered category state.
 * @returns The combined categories and transactions.
 */
export const createCategoryBreakdown = (
    transactions: Transaction[],
    categoriesOrderedById: CategoryState['orderedData']['byId'],
    includeEmptyCategories = false,
) => {
    const createEmptyCategories = () => {
        const categories = Object.values(categoriesOrderedById).reduce(
            (acc: ICategoryBreakdown, datum) => {
                acc[datum.id] = {
                    value: 0,
                    label: datum.label,
                    colour: datum.colour,
                };
                return acc;
            },
            {
                uncategorised: {
                    value: 0,
                    label: 'Uncategorised',
                    colour: '#bec3c7',
                },
            },
        );
        return categories;
    };

    const categoryBreakdown = transactions.reduce(
        (acc: ICategoryBreakdown, transaction) => {
            if (
                transaction.category_id &&
                transaction.category_id in categoriesOrderedById
            ) {
                if (!(transaction.category_id in acc)) {
                    acc[transaction.category_id] = {
                        value: 0,
                        label: categoriesOrderedById[transaction.category_id]
                            .label,
                        colour: categoriesOrderedById[transaction.category_id]
                            .colour,
                    };
                }
                acc[transaction.category_id].value += transaction.debit;
            } else {
                acc.uncategorised.value += transaction.debit;
            }
            return acc;
        },
        includeEmptyCategories
            ? createEmptyCategories()
            : {
                  uncategorised: {
                      value: 0,
                      label: 'Uncategorised',
                      colour: '#bec3c7',
                  },
              },
    );

    return categoryBreakdown;
};

/**
 * Creates a list of budget comparison data for general consumption in charts and insight generation.
 *
 * Each datum represents a category and its calculated values.
 * @param categoryBreakdown The category breakdown from {@link createCategoryBreakdown}.
 * @param budget The selected budget.
 * @param numMonths Metric used to multiply the budget. Supply the number of months included in the transaction range.
 * @returns A list of BudgetDatums.
 */
export const createBudgetChartData = (
    categoryBreakdown: ICategoryBreakdown,
    budget: IBudget,
    numMonths = 1,
) => {
    const chart = Object.entries(categoryBreakdown).reduce(
        (acc: IBudgetDatum[], [uid, each]) => {
            const budgetDatum = budget.budgetRows[Number(uid)];
            const normalisedValue = normaliseNum(each.value);

            if (budgetDatum?.value) {
                const budgetValue = numMonths * budgetDatum.value;
                const diffFloat = normaliseNum(normalisedValue - budgetValue);
                const diffPc = normaliseNum((diffFloat / budgetValue) * 100);
                acc.push({
                    budget: normaliseNum(budgetDatum.value * numMonths),
                    categoryId: Number(uid),
                    categoryName: each.label,
                    colour: each.colour,
                    diffFloat,
                    diffPc,
                    spend: normaliseNum(each.value),
                    variance: [budgetDatum.varLowPc, budgetDatum.varHighPc],
                });
            } else {
                acc.push({
                    budget: 0,
                    categoryId: Number(uid),
                    categoryName: each.label,
                    colour: each.colour,
                    diffFloat: 0,
                    diffPc: 0,
                    spend: normalisedValue,
                    variance: [0, 0],
                });
            }

            return acc;
        },
        [],
    );

    return chart;
};
