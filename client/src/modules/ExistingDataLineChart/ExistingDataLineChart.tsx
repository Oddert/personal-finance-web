import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

import { Box, Paper } from '@mui/material'

import { LOCALE } from '../../constants/appConstants'

import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors'
import { Transaction } from '../../types/Transaction'

const chart1BaseOptions: ApexOptions = {
    chart: {
        id: 'existing-data-line-chart',
        // group: 'all-transactions',
        type: 'line',
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
        // categories: ['cat 1', 'cat 2', 'cat 3', 'cat 4', 'cat 5', 'cat 6'],
        labels: {
            style: {
                colors: '#fff',
            },
            formatter: val => new Date(val).toLocaleDateString(LOCALE)
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
                    return String(number)
                }
                const str = number.toString().split('.')
                if (str[0].length >= 4) {
                    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
                }
                if (str[1] && str[1].length >= 4) {
                    str[1] = str[1].replace(/(\d{3})/g, '$1,')
                }
                return str.join('.')
            }
        },
    },
}

const chart2BaseOptions: ApexOptions = {
    chart: {
        id: 'credit-debit-chart',
        // group: 'all-transactions',
        type: 'bar',
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
            formatter: val => new Date(val).toLocaleDateString(LOCALE)
        },
        tickAmount: 10,
    },
    yaxis: {
        labels: {
            style: {
                colors: '#fff',
            },
        },
        // max: debitMax,
    },
}

const ExistingDataLineChart = () => {
    const [ballanceData, setBallanceData] =
        useState<{ x: number|string, y: number }[]>([])
    const [debitData, setDebitData] = 
        useState<{ x: number|string, y: number }[]>([])
    const [debitTransactions, setDebitTransactions] = useState<Transaction[]>([])
    const [creditData, setCreditData] = 
        useState<{ x: number|string, y: number }[]>([])
    const [debitMax, setDebitMax] = useState<number>(0)

    // Workaround for issue owners seem unwilling / unable to resolve:
    // https://github.com/apexcharts/react-apexcharts/issues/182
    // https://github.com/apexcharts/react-apexcharts/issues/31
    const [chart1Options, setChart1Options] = useState<ApexOptions>(chart1BaseOptions)
    const [chart2Options, setChart2Options] = useState<ApexOptions>(chart2BaseOptions)

    const transactions = useSelector(getTransactionsResponse)
    
    useEffect(() => {
        const sorted = transactions.reduce((acc: {
            ballance: { x: number|string, y: number }[],
            debit: { x: number|string, y: number }[],
            credit: { x: number|string, y: number }[],
            debitMax: number,
            debitTransactions: Transaction[],
        }, transaction) => {
            acc.ballance.push({
                x: transaction.date,
                y: transaction.ballance,
            })
            if (transaction.debit) {
                acc.debit.push({
                    x: transaction.date,
                    y: transaction.debit,
                })
                if (transaction.debit > acc.debitMax) {
                    acc.debitMax = transaction.debit
                }
                acc.debitTransactions.push(transaction)
            }
            if (transaction.credit) {
                acc.credit.push({
                    x: transaction.date,
                    y: transaction.credit,
                })
            }
            return acc
        }, {
            ballance: [],
            debit: [],
            credit: [],
            debitMax: 0,
            debitTransactions: [],
        })
        setDebitMax(sorted.debitMax)
        setDebitTransactions(sorted.debitTransactions)
        setBallanceData(sorted.ballance)
        setDebitData(sorted.debit)
        setCreditData(sorted.credit)
    }, [transactions])

    useEffect(() => {
        setChart1Options(chart1BaseOptions)
        setChart2Options({
            ...chart2BaseOptions,
            tooltip: {
                ...chart2BaseOptions.tooltip,
                y: {
                    formatter: (val, opts) =>
                        `${debitTransactions[opts.dataPointIndex].description} : ${val}`,
                },
            },
            yaxis: {
                ...chart2BaseOptions.yaxis,
                max: debitMax,
            },
        })
    }, [debitTransactions, debitMax])

    return (
        <Paper
            elevation={4}
            sx={(theme) => ({
                margin: '20px 0 0',
                padding: '20px',
                '& #apexchartsexisting-data-line-chart, & #apexchartscredit-debit-chart': {
                    margin: '0 auto',
                },
                color: theme.palette.common.black,
                '& *': {
                    color: theme.palette.common.black,
                },
            })}
        >
            <Chart
                options={chart1Options}
                series={[
                    {
                        name: 'Ballance',
                        data: ballanceData,
                    },
                    // {
                    //     name: 'Out',
                    //     type: 'bar',
                    //     data: debitData,
                    // },
                    // {
                    //     name: 'Out',
                    //     type: 'bar',
                    //     data: creditData,
                    // }
                    // {
                    //     name: 'Ballance',
                    //     data: [
                    //         { x: 'cat 1', y: 5 },
                    //         { x: 'cat 2', y: 2 },
                    //         { x: 'cat 3', y: 8 },
                    //         { x: 'cat 4', y: 4 },
                    //         { x: 'cat 5', y: 9 },
                    //         { x: 'cat 6', y: 1 },
                    //     ],
                    // }
                ]}
                type='line'
                width='80%'
                height='400px'
            />
            <Box sx={{ position: 'relative' }}>
                <Chart
                    options={chart2Options}
                    series={[
                        {
                            name: 'Debit',
                            data: debitData,
                        },
                        {
                            name: 'Credit',
                            data: creditData,
                        },
                    ]}
                    type='bar'
                    width='80%'
                    height='200px'
                />
            </Box>
        </Paper>
    )
}

export default ExistingDataLineChart
