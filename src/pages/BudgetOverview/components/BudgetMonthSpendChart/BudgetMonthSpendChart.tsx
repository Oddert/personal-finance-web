import { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import { Box, Button } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import { IAgDataAccumulator, IProps } from './BudgetMonthSpendChart.type';

const budgetMonthSpendId = 'budget-month-spend';

/**
 * Displays each budgets raw spend value across the date range.
 *
 * "Spiritually" connected to the equivalent {@link BudgetBreakdown/components/BudgetMonthSpendChart} in BudgetBreakdown.
 * @param props.chartList The pre-calculated Budget Overview charts.
 * @param props.endDate The start date for the date range.
 * @param props.startDate The end date for the date range.
 */
const BudgetMonthSpendChart: FC<IProps> = ({
    chartList,
    endDate,
    showFullDateRange,
    startDate,
}) => {
    const { t } = useTranslation();

    const series: { name: string; data: { x: number; y: number }[] }[] =
        useMemo(() => {
            const aggregatedData = chartList.reduce(
                (acc: IAgDataAccumulator, monthData) => {
                    monthData.data.forEach((categoryData) => {
                        if (!(categoryData.categoryId in acc)) {
                            acc[categoryData.categoryId] = {
                                name: categoryData.categoryName,
                                data: [],
                            };
                        }
                        acc[categoryData.categoryId].data.push({
                            x: monthData.timestamp.valueOf(),
                            y: categoryData.spend,
                        });
                    });
                    return acc;
                },
                {},
            );

            return Object.values(aggregatedData);
        }, [chartList]);

    const handleClickToggle = () => {
        series.map((value) =>
            ApexCharts.exec(budgetMonthSpendId, 'toggleSeries', value.name),
        );
    };

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Fragment>
            <Box
                sx={(theme) => ({
                    '& *': {
                        color: theme.palette.common.black,
                    },
                })}
            >
                <Chart
                    type='line'
                    height={500}
                    width={700}
                    options={{
                        chart: {
                            id: budgetMonthSpendId,
                            height: 500,
                            type: 'line',
                            zoom: {
                                allowMouseWheelZoom: false,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        fill: {
                            type: 'solid',
                        },
                        grid: {
                            show: true,
                            strokeDashArray: 2,
                            row: {
                                opacity: 0.5,
                            },
                            xaxis: {
                                lines: {
                                    show: true,
                                },
                            },
                        },
                        legend: {
                            labels: {
                                colors: '#fff',
                            },
                        },
                        markers: {
                            size: 1,
                        },
                        stroke: {
                            curve: 'straight',
                            width: 2,
                        },
                        tooltip: {
                            x: {
                                format: 'dd/MM/yy',
                            },
                            y: {
                                formatter: (val) => currencyLocaliser(val),
                            },
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                style: {
                                    colors: '#fff',
                                },
                            },
                            min: showFullDateRange
                                ? new Date(String(startDate)).getTime()
                                : undefined,
                            max: showFullDateRange
                                ? new Date(String(endDate)).getTime()
                                : undefined,
                        },
                        yaxis: {
                            tickAmount: 20,
                            labels: {
                                style: {
                                    colors: '#fff',
                                },
                                formatter: (val) => currencyLocaliser(val),
                            },
                        },
                    }}
                    series={series}
                />
            </Box>
            <Button onClick={handleClickToggle} variant='contained'>
                {t('buttons.toggleAllCategories')}
            </Button>
        </Fragment>
    );
};

export default BudgetMonthSpendChart;
