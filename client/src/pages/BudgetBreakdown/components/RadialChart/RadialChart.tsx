import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

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

    return (
        <Chart
            options={{
                chart: {
                    type: 'donut',
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
                labels,
                // fight me americans
                colors: colours,
                legend: {
                    labels: {
                        colors: '#fff',
                    },
                    horizontalAlign: 'left',
                },
            }}
            series={series}
            type='donut'
            width={500}
            height='400px'
        />
    );
};

export default RadialChart;
