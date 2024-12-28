import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { IProps } from './RadialChart.types';

const RadialChart: FC<IProps> = ({ categoryBreakdown }) => {
    const { labels, series } = useMemo(() => {
            const asArray = Object.values(categoryBreakdown);
            const labels = asArray.map((category) => category.label)
            const series = asArray.map((category) => Number(category.value.toFixed(2)))
            return { labels, series };
        },
        [categoryBreakdown],
    );

    return (
        <Chart
            options={{
                chart: {
                    type: 'donut',
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom',
                        }
                    }
                }],
                labels,
            }}
            series={series}
            type='donut'
            width={500}
            height='400px'
        />
    )
};

export default RadialChart;
