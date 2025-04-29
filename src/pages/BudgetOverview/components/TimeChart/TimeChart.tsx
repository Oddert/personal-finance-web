import { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';

import { Box, Button } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import type { IProps } from './TimeChart.types';

const discrepancyTimeChartId = 'discrepancy-time-chart';

/**
 * Area Chart component.
 *
 * Displays spend discrepancies (as currency) across the time period.
 * @category Pages
 * @subcategory Budget Overview
 * @component
 * @param props.chartList The list of pre-formatted Percentage Chart objects, used as a starting point for the data transform.
 * @param props.endDate The start date for the date range.
 * @param props.startDate The end date for the date range.
 */
const TimeChart: FC<IProps> = ({
    chartList,
    endDate,
    showFullDateRange,
    startDate,
}) => {
    const { t } = useTranslation();

    const series = useMemo(() => {
        chartList.map((chart) => [chart.data, chart.timestamp]);

        interface IAccumulator {
            totalTimeList: number[];
            times: {
                [categoryName: string]: {
                    [timestamp: number]: number;
                };
            };
        }

        const { times, totalTimeList } = chartList.reduce(
            (acc: IAccumulator, chart) => {
                const timestamp = chart.timestamp.valueOf();
                acc.totalTimeList.push(timestamp);
                chart.data.forEach((budgetDatum) => {
                    const { categoryName } = budgetDatum;

                    if (!(categoryName in acc.times)) {
                        acc.times[categoryName] = {};
                    }
                    acc.times[categoryName][timestamp] = budgetDatum.diffPc;
                });
                return acc;
            },
            {
                totalTimeList: [],
                times: {},
            },
        );

        const createdSeries = Object.entries(times).map(
            ([categoryName, timeSeries]) => {
                return {
                    name: categoryName,
                    data: totalTimeList.map((time: number) => {
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
            },
        );

        return createdSeries;
    }, [chartList]);

    const handleClickToggle = () => {
        series.map((value) =>
            ApexCharts.exec(discrepancyTimeChartId, 'toggleSeries', value.name),
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
                            id: discrepancyTimeChartId,
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
                            shared: true,
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
                            tickAmount: 16,
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
                {t('Buttons.toggleAllCategories')}
            </Button>
        </Fragment>
    );
};

export default TimeChart;
