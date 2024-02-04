import { ApexOptions } from 'apexcharts';

import { LOCALE } from '../../constants/appConstants';

import theme from '../../theme';

import { largeValueFormatter } from '../../utils/chartUtils';

export const chart1BaseOptions: ApexOptions = {
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
        size: 2,
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
    //                     <p>${new Date(datum.x).toLocaleDateString(LOCALE)}</p>
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
            formatter: val => new Date(val).toLocaleDateString(LOCALE)
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
}
