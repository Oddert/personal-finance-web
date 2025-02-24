import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import type { IBudgetDatum } from '../../types/Budget.types';

import useLocalisedNumber from '../../hooks/useLocalisedNumber';

import type { IProps, ISeriesDatum } from './BudgetPercentageChart.types';
import { useTranslation } from 'react-i18next';

/**
 * Vertical bar chart showing positive and negative discrepancies for a list of budget spend items.
 *
 * Supports both actual currency values and percentage over / under spend.
 * @category Component
 * @subcategory Budget Percentage Chart
 * @component
 * @param props.data The series of budget data.
 * @param props.dataPointCallback Callback function invoked when a data point is clicked.
 * @param props.height Chart height (default: 350).
 * @param props.useFloat If true, raw currency values will be used. If false, percentages will be used.
 * @param props.width Chart width (default: 350).
 */
const BudgetPercentageChart: FC<IProps> = ({
    data,
    dataPointCallback,
    height = 350,
    useFloat = false,
    width = 350,
}) => {
    const { t } = useTranslation();

    const { categoryIdsOrdered, seriesData, seriesRef } = useMemo(() => {
        const values = Object.values(data);

        return values.reduce(
            (
                acc: {
                    categoryIdsOrdered: number[];
                    seriesData: ISeriesDatum[];
                    seriesRef: IBudgetDatum[];
                },
                budgetDatum,
            ) => {
                acc.seriesData.push({
                    x: budgetDatum.categoryName,
                    y: useFloat ? budgetDatum.diffFloat : budgetDatum.diffPc,
                    fillColor: budgetDatum.colour,
                });
                acc.seriesRef.push(budgetDatum);
                acc.categoryIdsOrdered.push(budgetDatum.categoryId);
                return acc;
            },
            {
                categoryIdsOrdered: [],
                seriesData: [],
                seriesRef: [],
            },
        );
    }, [data, useFloat]);

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Box
            sx={(theme) => ({
                '& *': {
                    color: theme.palette.common.white,
                },
            })}
        >
            <Chart
                type='bar'
                height={height}
                width={width}
                options={{
                    chart: {
                        type: 'bar',
                        height: height,
                        toolbar: {
                            show: false,
                        },
                        events: {
                            dataPointSelection: (event, chartContext, opts) => {
                                if (dataPointCallback) {
                                    dataPointCallback(
                                        categoryIdsOrdered[opts.dataPointIndex],
                                    );
                                }
                            },
                        },
                        zoom: {
                            allowMouseWheelZoom: false,
                        },
                    },
                    legend: {
                        show: false,
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            borderRadiusApplication: 'end',
                            horizontal: true,
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    grid: {
                        xaxis: {
                            lines: {
                                show: true,
                            },
                        },
                        yaxis: {
                            lines: {
                                show: true,
                            },
                        },
                    },
                    tooltip: {
                        y: {
                            title: {
                                formatter: () => '',
                            },
                            formatter: (value, opts) => {
                                const budgetDatum =
                                    seriesRef[opts.dataPointIndex];
                                return `
									<p>${t('Discrepancy pc')}: ${Number(value) >= 0 ? `+${value}%` : `${value}%`}</p>
									<p>${t('Discrepancy val')}: ${budgetDatum.diffFloat < 0 ? `-${currencyLocaliser(Math.abs(budgetDatum.diffFloat))}` : `+${currencyLocaliser(budgetDatum.diffFloat)}`}</p>
									<p>${t('literals.Expected')}: ${currencyLocaliser(budgetDatum.budget)}</p>
									<p>${t('literals.Actual')}: ${currencyLocaliser(budgetDatum.spend)}</p>
								`;
                            },
                        },
                    },
                    xaxis: {
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                    },
                }}
                series={[
                    {
                        data: seriesData,
                    },
                ]}
            />
        </Box>
    );
};

export default BudgetPercentageChart;
