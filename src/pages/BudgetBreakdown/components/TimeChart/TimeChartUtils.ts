import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Category } from '../../../../types/Category.d';
import { Transaction } from '../../../../types/Transaction.d';

import { ISortedByCategory, ISortedByCategoryRow } from './TimeChart.types';

dayjs.extend(localizedFormat);

export const generateTimeChartSeries = (
    categories: {
        [id: string]: Category;
    },
    endDate: Dayjs,
    filteredTransactions: Transaction[],
    includeCredit: boolean,
    startDate: Dayjs,
) => {
    const dates: number[] = [];
    const endDateJs = dayjs(endDate).startOf('date');
    let date = dayjs(startDate).startOf('date');

    while (date.valueOf() <= endDateJs.valueOf()) {
        dates.push(date.valueOf());
        date = date.add(1, 'day');
    }

    const sortedByCategory = filteredTransactions.reduce(
        (acc: ISortedByCategory, each) => {
            if (each.categoryId) {
                if (!(each.categoryId in acc)) {
                    const foundCategory = categories[each.categoryId];
                    acc[each.categoryId] = {
                        label:
                            foundCategory?.label ||
                            `Category ID ${each.categoryId}`,
                        id: each.categoryId,
                        transactions: {},
                    };
                }
                const dateInt = dayjs(each.date).startOf('date').valueOf();
                if (!(dateInt in acc[each.categoryId].transactions)) {
                    acc[each.categoryId].transactions[dateInt] = [];
                }
                acc[each.categoryId].transactions[dateInt].push(each);
            }
            return acc;
        },
        {},
    );

    const nextSeries = Object.values(sortedByCategory).map(
        (seriesItem: ISortedByCategoryRow) => {
            const { data } = dates.reduce(
                (
                    accumulator: {
                        data: { x: string; y: number }[];
                        total: number;
                    },
                    nextDate,
                ) => {
                    if (nextDate in seriesItem.transactions) {
                        accumulator.total += seriesItem.transactions[
                            nextDate
                        ].reduce(
                            (a, e) =>
                                includeCredit
                                    ? a + e.debit - e.credit
                                    : a + e.debit,
                            0,
                        );
                    }
                    accumulator.data.push({
                        x: dayjs(nextDate).toISOString(),
                        y: accumulator.total,
                    });
                    return accumulator;
                },
                { data: [], total: 0 },
            );

            return {
                name: seriesItem.label,
                data,
            };
        },
    );

    return nextSeries;
};
