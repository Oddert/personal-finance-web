import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, useTheme } from '@mui/material';

import { IProps } from './CandleStickChart.types';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

dayjs.extend(localizedFormat);

/**
 * Displays the highest, lowest, start, and finish ballance across each month within the range.
 * @component
 * @category Pages
 * @subcategory Budget Overview
 * @param props.endDate The start date for the date range.
 * @param props.startDate The end date for the date range.
 * @param props.transactions The list of transactions ordered by date.
 */
const CandleStickChart: FC<IProps> = ({ endDate, startDate, transactions }) => {
    const data = useMemo(() => {
        let sDate = dayjs(startDate);
        const seriesData: {
            x: number;
            y: number[];
        }[] = [];

        while (sDate < endDate) {
            const year = sDate.year();
            const month = sDate.month();
            if (year in transactions && month in transactions[year]) {
                const monthTransactions = transactions[year][month];
                const startBallance = monthTransactions[0].ballance;
                const endBallance =
                    monthTransactions[monthTransactions.length - 1].ballance;
                const { highValue, lowValue } = monthTransactions.reduce(
                    (
                        acc: {
                            highValue: number | null;
                            lowValue: number | null;
                        },
                        transaction,
                    ) => {
                        if (
                            !acc.highValue ||
                            transaction.ballance > acc.highValue
                        ) {
                            acc.highValue = transaction.ballance;
                        }
                        if (
                            !acc.lowValue ||
                            transaction.ballance < acc.lowValue
                        ) {
                            acc.lowValue = transaction.ballance;
                        }
                        return acc;
                    },
                    { highValue: null, lowValue: null },
                );
                const chart = {
                    x: sDate.valueOf(),
                    y: [
                        startBallance,
                        highValue || 0,
                        lowValue || 0,
                        endBallance,
                    ],
                };
                seriesData.push(chart);
            }
            sDate = sDate.add(1, 'month').set('date', 10);
        }

        return seriesData;
    }, [transactions]);

    const theme = useTheme();

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Box
            sx={{
                '& *': {
                    color: theme.palette.primary.contrastText,
                    '& .apexcharts-tooltip-candlestick': {
                        padding: '8px',
                        '& div': {
                            display: 'flex',
                            justifyContent: 'space-between',
                            gridGap: '8px',
                            '& span': {
                                fontWeight: 'bold',
                            },
                        },
                    },
                },
            }}
        >
            <Chart
                type='candlestick'
                height={500}
                width={700}
                options={{
                    chart: {
                        type: 'candlestick',
                        height: 350,
                        zoom: {
                            allowMouseWheelZoom: false,
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    fill: {
                        type: 'solid',
                        gradient: {
                            opacityFrom: 0.6,
                            opacityTo: 0.8,
                        },
                    },
                    legend: {
                        labels: {
                            colors: '#fff',
                        },
                    },
                    plotOptions: {
                        candlestick: {
                            colors: {
                                upward: theme.palette.success.main,
                                downward: theme.palette.error.main,
                            },
                        },
                    },
                    stroke: {
                        curve: 'straight',
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy',
                        },
                        shared: true,
                        custom: ({ seriesIndex, dataPointIndex, w }) => {
                            const o = currencyLocaliser(
                                w.globals.seriesCandleO[seriesIndex][
                                    dataPointIndex
                                ],
                            );
                            const h = currencyLocaliser(
                                w.globals.seriesCandleH[seriesIndex][
                                    dataPointIndex
                                ],
                            );
                            const l = currencyLocaliser(
                                w.globals.seriesCandleL[seriesIndex][
                                    dataPointIndex
                                ],
                            );
                            const c = currencyLocaliser(
                                w.globals.seriesCandleC[seriesIndex][
                                    dataPointIndex
                                ],
                            );
                            return (
                                '<div class="apexcharts-tooltip-candlestick">' +
                                '<div>Open: <span class="value">' +
                                o +
                                '</span></div>' +
                                '<div>High: <span class="value">' +
                                h +
                                '</span></div>' +
                                '<div>Low: <span class="value">' +
                                l +
                                '</span></div>' +
                                '<div>Close: <span class="value">' +
                                c +
                                '</span></div>' +
                                '</div>'
                            );
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
                    yaxis: {
                        tickAmount: 10,
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                            formatter: (val) => {
                                return currencyLocaliser(Math.floor(val));
                            },
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                }}
                series={[
                    {
                        data,
                    },
                ]}
            />
        </Box>
    );
};

export default CandleStickChart;
