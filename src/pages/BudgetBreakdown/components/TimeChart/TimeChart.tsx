import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box } from '@mui/material';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
// import useContentWidth from '../../../../hooks/useContentWidth';

import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

import type { IProps } from './TimeChart.types';
import { generateTimeChartSeries } from './TimeChartUtils';

dayjs.extend(localizedFormat);

/**
 * Area chart showing how each category's spend aggregates across the time period.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const TimeChart: FC<IProps> = ({
    endDate,
    filteredTransactions,
    startDate,
}) => {
    const categories = useAppSelector(getCategoryOrderedDataById);

    // const { contentWidth } = useContentWidth();

    const series = useMemo(
        () =>
            generateTimeChartSeries(
                categories,
                endDate,
                filteredTransactions,
                startDate,
            ),
        [categories, endDate, filteredTransactions, startDate],
    );

    return (
        <Box
            sx={(theme) => ({
                '& *': {
                    color: theme.palette.primary.contrastText,
                },
            })}
        >
            <Chart
                type='area'
                // width={contentWidth}
                height={500}
                width={1000}
                options={{
                    chart: {
                        height: 350,
                        type: 'area',
                        stacked: true,
                        zoom: {
                            enabled: true,
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
            />
        </Box>
    );
};

export default TimeChart;
