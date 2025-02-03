import { ApexOptions } from 'apexcharts';

import { LOCALE } from '../../constants/appConstants';

/**
 * The chart title for Existing Data Line Chart.
 */
export const title = 'Past Data';

export const chart1BaseOptions: ApexOptions = {
    chart: {
        id: 'existing-data-line-chart',
        // group: 'all-transactions',
        type: 'line',
        zoom: {
            allowMouseWheelZoom: false,
        },
    },
    grid: {
        show: true,
        row: {
            colors: ['rgba(243, 243, 243, 0.3)', 'transparent'],
        },
    },
    markers: {
        size: 2,
    },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    xaxis: {
        labels: {
            style: {
                colors: '#fff',
            },
            formatter: (val) => new Date(val).toLocaleDateString(LOCALE),
        },
        tickAmount: 10,
    },
    yaxis: {
        tickAmount: 12,
        labels: {
            style: {
                colors: '#fff',
            },
            formatter: (number) => {
                if (number === null || isNaN(number)) {
                    return String(number);
                }
                const str = number.toString().split('.');
                if (str[0].length >= 4) {
                    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                }
                if (str[1] && str[1].length >= 4) {
                    str[1] = str[1].replace(/(\d{3})/g, '$1,');
                }
                return str.join('.');
            },
        },
    },
};

export const chart2BaseOptions: ApexOptions = {
    chart: {
        id: 'credit-debit-chart',
        // group: 'all-transactions',
        type: 'bar',
        zoom: {
            allowMouseWheelZoom: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    grid: {
        row: {
            colors: ['rgba(243, 243, 243, 0.3)', 'transparent'],
        },
    },
    legend: {
        labels: {
            colors: '#fff',
        },
    },
    // tooltip: {
    //     y: {
    //         formatter: (val, opts) =>
    //             `${debitTransactions[opts.dataPointIndex].description} : ${val}`,
    //     },
    // },
    xaxis: {
        labels: {
            style: {
                colors: '#fff',
            },
            formatter: (val) => new Date(val).toLocaleDateString(LOCALE),
        },
        tickAmount: 10,
    },
    yaxis: {
        labels: {
            style: {
                colors: '#fff',
            },
        },
        tickAmount: 5,
        forceNiceScale: true,
        // max: debitMax,
    },
};

export const defaultEnd = new Date();

const defaultStartConstructor = new Date();
defaultStartConstructor.setMonth(defaultStartConstructor.getMonth() - 3);
defaultStartConstructor.setDate(0);

export const defaultStart = new Date(defaultStartConstructor);
