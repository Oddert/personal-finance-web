import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box } from '@mui/material';

import { Category } from '../../../../types/Category.d';

import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import {
    IAgDataAccumulator,
    IPivotAccumulator,
    IProps,
    ISPendChartMonth,
    ISpendChartYear,
} from './BudgetMonthSpendChart.type';
import { createReadableNumber } from '../../../../utils/commonUtils';

dayjs.extend(localizedFormat);

/**
 * Displays each budgets raw spend value across the date range.
 *
 * "Spiritually" connected to the equivalent {@link BudgetOverview/components/BudgetMonthSpendChart} in BudgetOverview.
 * @param props.chartList The pre-calculated Budget Overview charts.
 * @param props.endDate The start date for the date range.
 * @param props.startDate The end date for the date range.
 */
const BudgetMonthSpendChart: FC<IProps> = ({
    endDate,
    filteredTransactions,
    startDate,
}) => {
    const categories = useAppSelector(getCategoryOrderedDataById);
    const series = useMemo(() => {
        // Filter over all transactions in range and arrange them into sorted objects by year and month (as time series is month based).
        const { allCategories, categoriesByDate } = filteredTransactions.reduce(
            (acc: IAgDataAccumulator, transaction) => {
                const date = dayjs(transaction.date);
                const year = date.year();
                const month = date.month();

                const foundCategory: Category | undefined =
                    categories[transaction.category_id || -1];

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
                if (!transaction.category_id || !foundCategory) {
                    if (
                        !('uncategorised' in acc.categoriesByDate[year][month])
                    ) {
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
                            transaction.category_id in
                            acc.categoriesByDate[year][month]
                        )
                    ) {
                        acc.categoriesByDate[year][month] = {
                            ...acc.categoriesByDate[year][month],
                            [transaction.category_id]: {
                                categoryName: foundCategory.label,
                                colour: foundCategory.colour,
                                value: 0,
                            },
                        };
                    }
                    // Increment the category value
                    acc.categoriesByDate[year][month][
                        transaction.category_id
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
                        const date = dayjs(`${year}/${month}/01`).toISOString();
                        categoryList.forEach((category) => {
                            const categoryId = category.categoryId;
                            if (!(categoryId in acc)) {
                                acc[Number(categoryId)] = {
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

        return Object.values(pivotedData);
    }, [categories, filteredTransactions]);

    return (
        <Box
            sx={(theme) => ({
                '& *': {
                    color: theme.palette.primary.contrastText,
                },
            })}
        >
            <Chart
                type='line'
                height={500}
                width={700}
                options={{
                    chart: {
                        height: 500,
                        type: 'area',
                        stacked: true,
                        zoom: {
                            enabled: true,
                            allowMouseWheelZoom: false,
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            opacityFrom: 0.6,
                            opacityTo: 0.8,
                        },
                    },
                    stroke: {
                        curve: 'straight',
                    },
                    yaxis: {
                        tickAmount: 20,
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                            formatter(val) {
                                return `£${createReadableNumber(val) || ''}`;
                            },
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                        min: new Date(String(startDate)).getTime(),
                        max: new Date(String(endDate)).getTime(),
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy',
                        },
                        y: {
                            formatter(val) {
                                return `£${createReadableNumber(val) || ''}`;
                            },
                        },
                        shared: true,
                    },
                    legend: {
                        labels: {
                            colors: '#fff',
                        },
                    },
                }}
                series={series}
                // series={[{ name: 'food', data: [1, 2, 3] }]}
            />
        </Box>
    );
};

export default BudgetMonthSpendChart;
