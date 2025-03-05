import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import type { IProps } from './RadialChart.types';

/**
 * Donut chart showing the percentage breakdown if each category's spend.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const RadialChart: FC<IProps> = ({ categoryBreakdown }) => {
    const { labels, series, colours } = useMemo(() => {
        const asArray = Object.values(categoryBreakdown);
        const combined = asArray.reduce(
            (
                acc: { labels: string[]; series: number[]; colours: string[] },
                category,
            ) => {
                acc.labels.push(category.label);
                acc.series.push(Number(category.value.toFixed(2)));
                acc.colours.push(category.colour);
                return acc;
            },
            { labels: [], series: [], colours: [] },
        );
        return combined;
    }, [categoryBreakdown]);

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Box
            sx={{
                '& .radial_chart-tooltip .apexcharts-tooltip-title, .radial_chart-tooltip .apexcharts-tooltip-text':
                    { p: 1 },
            }}
        >
            <Chart
                height='400px'
                options={{
                    chart: {
                        type: 'donut',
                        zoom: {
                            allowMouseWheelZoom: false,
                        },
                    },
                    // fight me americans
                    colors: colours,
                    labels,
                    legend: {
                        labels: {
                            colors: '#fff',
                        },
                        horizontalAlign: 'left',
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy',
                        },
                        shared: true,
                        custom: ({ seriesIndex, w }) => {
                            const value = w.globals.initialSeries[seriesIndex];
                            const label = w.globals.labels[seriesIndex];
                            const colour = w.globals.colors[seriesIndex];
                            return `
                                <div class="radial_chart-tooltip">
                                    <div class="apexcharts-tooltip-title">
                                        ${label}
                                    </div>
                                    <div class="apexcharts-tooltip-text">
                                        <span class="apexcharts-tooltip-marker" style="color: ${colour};" shape="circle"></span>
                                        ${currencyLocaliser(value)}
                                    </div>
                                </div>
                            `;
                        },
                    },
                }}
                series={series}
                type='donut'
                width={500}
            />
        </Box>
    );
};

export default RadialChart;
