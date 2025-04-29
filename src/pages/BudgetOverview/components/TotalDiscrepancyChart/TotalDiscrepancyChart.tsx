import { FC, Fragment, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';

import { Box, Checkbox, FormControlLabel, Tab, Tabs } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import type { IProps } from './TotalDiscrepancyChart.types';

const aggregateTimeChartId = 'budget-time-chart';

const a11yProps = (index: number) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
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
const TotalDiscrepancyChart: FC<IProps> = ({
    chartList,
    endDate,
    startDate,
}) => {
    const [fullDateRange, setFullDateRange] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const [series1, series2] = useMemo(() => {
        const totals = chartList.map((datum) =>
            datum.data.reduce(
                (acc, each) => ({
                    budget: acc.budget + each.budget,
                    spend: acc.spend + each.spend,
                }),
                { budget: 0, spend: 0 },
            ),
        );

        const createdSeries1 = [
            {
                name: 'Discrepancy Value',
                data: chartList.map((each, idx) => ({
                    x: each.timestamp,
                    y: totals[idx].spend - totals[idx].budget,
                })),
            },
            {
                name: 'Spend',
                data: chartList.map((each, idx) => ({
                    x: each.timestamp,
                    y: totals[idx].spend,
                })),
            },
            {
                name: 'Budget',
                data: chartList.map((each, idx) => ({
                    x: each.timestamp,
                    y: totals[idx].budget,
                })),
            },
        ];
        const createdSeries2 = [
            {
                name: 'Discrepancy Pc',
                data: chartList.map((each, idx) => ({
                    x: each.timestamp,
                    y:
                        ((totals[idx].spend - totals[idx].budget) /
                            totals[idx].budget) *
                        100,
                })),
            },
        ];

        return [createdSeries1, createdSeries2];
    }, [chartList]);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Fragment>
            <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                aria-label='chart mode'
            >
                <Tab label='Spend Values' {...a11yProps(0)} />
                <Tab label='Percentage' {...a11yProps(1)} />
            </Tabs>
            <Box
                role='tabpanel'
                hidden={tabValue !== 0}
                id={`tabpanel-0`}
                aria-labelledby={`tab-0`}
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
                    series={series1}
                />
            </Box>
            <Box
                role='tabpanel'
                hidden={tabValue !== 1}
                id={`tabpanel-1`}
                aria-labelledby={`tab-1`}
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
                                    `${Math.floor(val * 100) / 100}%`,
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
                                formatter: (val) =>
                                    `${Math.floor(val * 100) / 100}%`,
                            },
                        },
                    }}
                    series={series2}
                />
            </Box>
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
        </Fragment>
    );
};

export default TotalDiscrepancyChart;
