import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Category } from '../../../../types/Category.d';
import { Transaction } from '../../../../types/Transaction.d';

import {
    IAgDataAccumulator,
    IAllCategories,
    IPivotAccumulator,
    ISeries,
    ISPendChartMonth,
    ISpendChartYear,
} from './BudgetMonthSpendChart.type';

dayjs.extend(localizedFormat);

export const generateMonthSpendData = (
    categories: {
        [id: string]: Category;
    },
    filteredTransactions: Transaction[],
): { series: ISeries[]; allCategories: IAllCategories } => {
    // Filter over all transactions in range and arrange them into sorted objects by year and month (as time series is month based).
    const { allCategories, categoriesByDate } = filteredTransactions.reduce(
        (acc: IAgDataAccumulator, transaction) => {
            const date = dayjs(transaction.date).startOf('date');
            const year = date.year();
            const month = date.month();

            const foundCategory: Category | undefined =
                categories[transaction.categoryId || -1];

            if (foundCategory) {
                if (!(foundCategory.id in acc.allCategories)) {
                    acc.allCategories[foundCategory.id] = {
                        categoryId: foundCategory.id,
                        categoryName: foundCategory.label,
                        colour: foundCategory.colour,
                    };
                }
            }

            // For year, month, and category ID, fill in missing levels of teh accumulator structure.
            if (!(year in acc.categoriesByDate)) {
                acc.categoriesByDate[year] = {};
            }
            if (!(month in acc.categoriesByDate[year])) {
                acc.categoriesByDate[year][month] = {};
            }
            if (!(month in acc.categoriesByDate[year])) {
                acc.categoriesByDate[year][month] = {};
            }
            // If the category is invalid, add or append to 'uncategorised'.
            if (!transaction.categoryId || !foundCategory) {
                if (!('uncategorised' in acc.categoriesByDate[year][month])) {
                    acc.categoriesByDate[year][month] = {
                        ...acc.categoriesByDate[year][month],
                        uncategorised: {
                            categoryName: 'Uncategorised',
                            colour: '#ffffff',
                            value: 0,
                        },
                    };
                }
                acc.categoriesByDate[year][month].uncategorised.value +=
                    transaction.debit - (transaction.credit || 0);
            } else {
                // Category is valid, optionally add the category to the year / month if needed.
                if (
                    !(
                        transaction.categoryId in
                        acc.categoriesByDate[year][month]
                    )
                ) {
                    acc.categoriesByDate[year][month] = {
                        ...acc.categoriesByDate[year][month],
                        [transaction.categoryId]: {
                            categoryName: foundCategory.label,
                            colour: foundCategory.colour,
                            value: 0,
                        },
                    };
                }
                // Increment the category value
                acc.categoriesByDate[year][month][
                    transaction.categoryId
                ].value += transaction.debit - transaction.credit;
            }
            return acc;
        },
        { allCategories: {}, categoriesByDate: {} },
    );

    const categoryList = Object.values(allCategories);

    // "Pivot" the sorted data to create a series object per category, and a `data` item per month.
    const pivotedData = Object.entries(categoriesByDate).reduce(
        (
            acc: IPivotAccumulator,
            [year, yearVal]: [string, ISpendChartYear],
        ) => {
            Object.entries(yearVal).forEach(
                ([month, monthVal]: [string, ISPendChartMonth]) => {
                    const date = dayjs(
                        `${year}/${Number(month) + 1}/01`,
                    ).toISOString();
                    categoryList.forEach((category) => {
                        const categoryId = category.categoryId;
                        if (!(categoryId in acc)) {
                            acc[Number(categoryId)] = {
                                categoryId,
                                name: category.categoryName,
                                data: [],
                            };
                        }
                        if (categoryId in monthVal) {
                            acc[Number(categoryId)].data.push({
                                x: date,
                                y: monthVal[categoryId].value,
                            });
                        } else {
                            acc[Number(categoryId)].data.push({
                                x: date,
                                y: 0,
                            });
                        }
                    });
                },
            );
            return acc;
        },
        {},
    );

    return { series: Object.values(pivotedData), allCategories };
};
