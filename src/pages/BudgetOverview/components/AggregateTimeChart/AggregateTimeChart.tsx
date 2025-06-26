import { FC, Fragment, SyntheticEvent, useMemo, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import { Box, Button, Tab, Tabs } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';
import Table from '../../../../components/Table';

import type { IProps } from './AggregateTimeChart.types';

const aggregateTimeChartId = 'budget-time-chart';

const a11yProps = (index: number) => ({
    id: `chart-tab-${index}`,
    'aria-controls': `chart-mode-${index}`,
});

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
const TimeChart: FC<IProps> = ({
    chartList,
    endDate,
    showFullDateRange,
    startDate,
}) => {
    const [tab, setTab] = useState(0);

    const { t } = useTranslation();

    const [series, timeList] = useMemo(() => {
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

        return [createdSeries, totalTimeList];
    }, [chartList]);

    const tableData = useMemo(
        () =>
            series.map((seriesItem) =>
                seriesItem.data.reduce(
                    (acc: { [key: string]: string | number }, each) => {
                        acc[`${each.x}`] = each.y;
                        return acc;
                    },
                    { category: seriesItem.name },
                ),
            ),
        [series],
    );

    const columns: ColumnDef<{ [key: string]: string | number }>[] = useMemo(
        () => [
            {
                header: 'Category',
                accessorKey: 'category',
            },
            ...timeList.map((timestamp, idx) => ({
                header: `${idx}`,
                accessorKey: `${timestamp}`,
                cell: (
                    cell: CellContext<
                        { [key: string]: string | number },
                        unknown
                    >,
                ) => {
                    const value = cell.renderValue() as number | string;
                    console.log(value);
                    return Number(value).toFixed(1);
                },
            })),
        ],
        [timeList],
    );

    console.log(series);

    const handleClickToggle = () => {
        series.map((value) =>
            ApexCharts.exec(aggregateTimeChartId, 'toggleSeries', value.name),
        );
    };

    const handleChange = (event: SyntheticEvent, nextTab: number) => {
        setTab(nextTab);
    };

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Fragment>
            <Box sx={{ display: 'flex' }}>
                <Tabs
                    aria-label='chart mode'
                    onChange={handleChange}
                    orientation='vertical'
                    value={tab}
                >
                    <Tab label='Chart' {...a11yProps(0)} />
                    <Tab label='Table' {...a11yProps(1)} />
                </Tabs>
                <Box
                    sx={(theme) => ({
                        '& *': {
                            color: theme.palette.common.black,
                        },
                    })}
                >
                    {tab === 0 ? (
                        <Chart
                            type='line'
                            height={500}
                            width={700}
                            options={{
                                chart: {
                                    id: aggregateTimeChartId,
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
                                        formatter: (val) =>
                                            currencyLocaliser(val),
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
                                    labels: {
                                        style: {
                                            colors: '#fff',
                                        },
                                        formatter: (val) =>
                                            currencyLocaliser(val),
                                    },
                                },
                            }}
                            series={series}
                        />
                    ) : (
                        <Box sx={{ '& *': { fontSize: '.9em' } }}>
                            <Table columns={columns} data={tableData} />
                        </Box>
                    )}
                </Box>
            </Box>
            <Button onClick={handleClickToggle} variant='contained'>
                {t('buttons.toggleAllCategories')}
            </Button>
        </Fragment>
    );
};

export default TimeChart;
