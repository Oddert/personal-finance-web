import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import { IAgDataAccumulator, IProps } from './BudgetMonthSpendChart.type';

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
    startDate,
}) => {
    const series = useMemo(() => {
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

    return (
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
                        height: 500,
                        type: 'area',
                        stacked: true,
                        zoom: {
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
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                            formatter: (val) => {
                                return `${Math.floor(val)}%`;
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
                            formatter: (val) => {
                                return val?.toFixed(2) || '';
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
