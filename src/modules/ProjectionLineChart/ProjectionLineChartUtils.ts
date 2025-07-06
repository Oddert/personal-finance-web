import { ApexOptions } from 'apexcharts';

import theme from '../../theme';

import { largeValueFormatter } from '../../utils/chartUtils';

export const MODULE_PROJECTION_PAST_BALLANCE =
    'MODULE_PROJECTION_PAST_BALLANCE';

export const defaultStart = new Date();
const defaultEndConstructor = new Date();
defaultEndConstructor.setMonth(defaultEndConstructor.getMonth() + 3);
defaultEndConstructor.setDate(0);

export const defaultEnd = new Date(defaultEndConstructor);

export const chart1BaseOptions = (
    compact: boolean,
    language: string,
): ApexOptions => ({
    chart: {
        id: 'existing-data-line-chart',
        type: 'line',
    },
    grid: {
        show: true,
        row: {
            colors: ['rgba(243, 243, 243, 0.3)', 'transparent'],
        },
    },
    legend: {
        show: true,
        labels: {
            colors: theme.palette.common.white,
        },
    },
    markers: {
        size: compact ? 0 : 2,
    },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    // tooltip: {
    //     custom: ({ series, seriesIndex, dataPointIndex, w }) => {
    //         const datum = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
    //         return `
    //             <div>
    //                 <div>
    //                     <p>${new Date(datum.x).toLocaleDateString(language)}</p>
    //                     </div>
    //                 <div>
    //                     <p>${CURRENCY_SYMBOL}${largeValueFormatter(datum.y)}</p>
    //                     ${
    //                         datum.label.length
    //                             ? `<p>${datum.label}</p>`
    //                             : ''
    //                     }
    //                 </div>
    //             </div>
    //         `
    //     }
    // },
    xaxis: {
        labels: {
            style: {
                colors: theme.palette.common.white,
            },
            formatter: (val: string) =>
                new Date(val).toLocaleDateString(language),
        },
        tickAmount: 10,
    },
    yaxis: {
        tickAmount: 12,
        labels: {
            style: {
                colors: theme.palette.common.white,
            },
            formatter: largeValueFormatter,
        },
    },
});
