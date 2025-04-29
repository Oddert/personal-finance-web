import { FC, Fragment, useMemo, useState } from 'react';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import type { IProps } from './TimeChart.types';

const aggregateTimeChartId = 'budget-time-chart';

/**
 * Area Chart component.
 *
 * Displays the month-to-month discrepancy across the selected time period.
 * @category Pages
 * @subcategory Budget Overview
 * @component
 * @param props.chartList The list of pre-formatted Percentage Chart objects, used as a starting point for the data transform.
 * @param props.endDate The start date for the date range.
 * @param props.startDate The end date for the date range.
 */
const TimeChart: FC<IProps> = ({ chartList, endDate, startDate }) => {
    const [fullDateRange, setFullDateRange] = useState(true);

    const series = useMemo(() => {
        chartList.map((chart) => [chart.data, chart.timestamp]);

        interface IAccumulator {
            totalTimeList: number[];
            times: {
                [categoryName: string]: {
                    [timestamp: number]: number;
                };
            };
            categories: {
                [categoryName: string]: number;
            };
        }

        const { times, totalTimeList } = chartList.reduce(
            (acc: IAccumulator, chart) => {
                const timestamp = chart.timestamp.valueOf();
                acc.totalTimeList.push(timestamp);
                chart.data.forEach((budgetDatum) => {
                    const { categoryName } = budgetDatum;

                    if (!(categoryName in acc.categories)) {
                        acc.categories[categoryName] = 0;
                        acc.times[categoryName] = {};
                    }
                    acc.categories[categoryName] += budgetDatum.diffPc;
                    acc.times[categoryName][timestamp] =
                        acc.categories[categoryName];
                });
                return acc;
            },
            {
                totalTimeList: [],
                times: {},
                categories: {},
            },
        );

        const createdSeries: {
            name: string;
            data: { x: number; y: number }[];
        }[] = Object.entries(times).map(([categoryName, timeSeries]) => {
            return {
                name: categoryName,
                data: totalTimeList.map((time) => {
                    if (time in timeSeries) {
                        return {
                            x: time,
                            y: timeSeries[time],
                        };
                    }
                    return {
                        x: time,
                        y: 0,
                    };
                }),
            };
        });

        return createdSeries;
    }, [chartList]);

    const handleClickToggle = () => {
        series.map((value) =>
            ApexCharts.exec(aggregateTimeChartId, 'toggleSeries', value.name),
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
                            id: aggregateTimeChartId,
                            height: 500,
                            type: 'line',
                            stacked: true,
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
                            shared: true,
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                style: {
                                    colors: '#fff',
                                },
                            },
                            min: fullDateRange
                                ? new Date(String(startDate)).getTime()
                                : undefined,
                            max: fullDateRange
                                ? new Date(String(endDate)).getTime()
                                : undefined,
                        },
                        yaxis: {
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    label='Show full date range'
                    control={
                        <Checkbox
                            checked={fullDateRange}
                            onChange={(event) =>
                                setFullDateRange(event.target.checked)
                            }
                        />
                    }
                />
                <Button onClick={handleClickToggle} variant='contained'>
                    Toggle all categories
                </Button>
            </Box>
        </Fragment>
    );
};

export default TimeChart;
