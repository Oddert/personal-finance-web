import { FC, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

import { Box, Paper, Typography } from '@mui/material'

import type { Transaction } from '../../types/Transaction'

import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors'

import { chart1BaseOptions, chart2BaseOptions, title } from './ExistingDataLineChartUtils'

interface Props {
    compact?: boolean
}

const ExistingDataLineChart: FC<Props> = ({ compact = false }) => {
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

    const width = useMemo(() => compact ? '100%' : '80%', [compact])

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
            <Typography
                sx={(theme) => ({
                    color: theme.palette.common.white,
                    width,
                    margin: '16px auto 32px',
                })}
                variant='h3'
            >
                {title}
            </Typography>
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
                width={width}
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
                    width={width}
                    height='200px'
                />
            </Box>
        </Paper>
    )
}

export default ExistingDataLineChart
