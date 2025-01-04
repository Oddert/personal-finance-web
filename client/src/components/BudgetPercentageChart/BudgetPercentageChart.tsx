import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import { IProps } from './BudgetPercentageChart.types';

const BudgetPercentageChart: FC<IProps> = ({ data }) => {
    const { categories, seriesData } = useMemo(() => {
        const values = Object.values(data);
        return values.reduce((a: { categories: string[], seriesData: number[] }, e) => {
            a.categories.push(e.categoryName)
            a.seriesData.push(e.diffPc)
            return a
        },
        {
            categories: [],
            seriesData: [],
        })
    }, [data]);

    return (
        <Box sx={(theme) => ({
            '& *': {
                color: theme.palette.primary.contrastText,
            }
        })}>
            <Chart
                type='bar'
                height={350}
                options={{
                    chart: {
                        type: 'bar',
                        height: 350,
                        toolbar: {
                            show: false,
                        },
                    },
                    plotOptions: {
                    bar: {
                        borderRadius: 4,
                        borderRadiusApplication: 'end',
                        horizontal: true,
                    }
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
                            formatter(value) {
                                return Number(value) >= 0 ? `+${value}%` : `${value}%`
                            },
                        },
                    },
                    xaxis: {
                        categories,
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
                series={[{
                    data: seriesData,
                }]}
            />
        </Box>
    )
}

export default BudgetPercentageChart;