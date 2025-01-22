import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import { IProps } from './BudgetMonthSpendChart.type';

const BudgetMonthSpendChart: FC<IProps> = ({
    chartList,
    endDate,
    startDate,
}) => {
    const series = useMemo(() => {
        interface Temp {
            [categoryId: number]: {
                name: string;
                data: { x: number; y: number }[];
            };
        }
        const m = chartList.reduce((acc: Temp, monthData) => {
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
        }, {});
        console.log(m);
        return Object.values(m);
    }, [chartList]);

    console.log({ series });

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
                            formatter(val) {
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
                            formatter(val) {
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
