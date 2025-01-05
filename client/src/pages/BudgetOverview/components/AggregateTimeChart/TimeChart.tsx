import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';
// import dayjs from 'dayjs';
// import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box } from '@mui/material';

import { IProps } from './TimeChart.types';

const TimeChart: FC<IProps> = ({ chartList, endDate, startDate }) => {
    const series = useMemo(() => {
        chartList.map(chart => [chart.data, chart.timestamp])

        interface IAccumulator {
            totalTimeList: number[]
            times: {
                [categoryName: string]: {
                    [timestamp: number]: number
                }
            }
            categories: {
                [categoryName: string]: number
            }
        }

        const { times, totalTimeList } = chartList.reduce((acc: IAccumulator, chart) => {
            const timestamp = chart.timestamp.valueOf()
            acc.totalTimeList.push(timestamp);
            chart.data.forEach((budgetDatum) => {
                const { categoryName } = budgetDatum
    
                if (!(categoryName in acc.categories)) {
                    acc.categories[categoryName] = 0
                    acc.times[categoryName] = {}
                }
                if (categoryName === 'home') {
                    console.log(timestamp, budgetDatum.diffPc, budgetDatum)
                }
                acc.categories[categoryName] += budgetDatum.diffPc;
                acc.times[categoryName][timestamp] =
                    acc.categories[categoryName]
            })
            return acc
        }, {
            totalTimeList: [],
            times: {},
            categories: {},
        })

        const series = Object.entries(times).map(([categoryName, timeSeries]) => {
            return {
                name: categoryName,
                data: totalTimeList.map((time) => {
                    if (time in timeSeries) {
                        return {
                            x: time,
                            y: timeSeries[time]
                        }
                    }
                    return {
                        x: time,
                        y: 0,
                    }
                })
            }
        })

        return series
    }, [chartList])

    return (
        <Box sx={(theme) => ({
            '& *': {
                color: theme.palette.primary.contrastText,
            }
        })}>
            <Chart
                type='area'
                height={500}
                width={700}
                options={{
                    chart: {
                        height: 500,
                        type: 'area',
                        stacked: true,
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            opacityFrom: 0.6,
                            opacityTo: 0.8,
                        }
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                            formatter(val) {
                                return `${Math.floor(val)}%`
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
                        min: new Date(startDate).getTime(),
                        max: new Date(endDate).getTime(),
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy'
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
            />
        </Box>
    )
}

export default TimeChart;
