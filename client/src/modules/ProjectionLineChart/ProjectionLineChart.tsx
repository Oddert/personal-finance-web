import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

import { Paper } from '@mui/material'

import { LOCALE } from '../../constants/appConstants'

import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors'

import { Transaction } from '../../types/Transaction'

const chart1BaseOptions: ApexOptions = {
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

const ProjectionLineChart = () => {
    const [pastBallance, setPastBallance] = useState<{ x: number|string, y: number|string }[]>([])
    
    const transactions = useSelector(getTransactionsOrderedByDate)

    useEffect(() => {
        const monthSets = Object.values(transactions).reduce(
            (acc: Transaction[][], yearObj) => {
                const months = Object.values(yearObj)
                return [...acc, ...months]
            },
            [],
        )
        const sampledData = monthSets.slice(-3).reduce(
            (acc, monthSet) => [...acc, ...monthSet],
            [],
        )
        const sampledDataObj = sampledData.reduce(
            (acc: { [key: number]: { x: number, y: number } }, datum) => {
                acc[datum.date] = {
                    x: datum.date,
                    y: datum.ballance
                }
                return acc
            },
            {},
        )
        const calculatedPastData = Object.values(sampledDataObj)
        setPastBallance(calculatedPastData)

    }, [transactions])

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
                options={chart1BaseOptions}
                series={[
                    {
                        name: 'Ballance',
                        data: pastBallance,
                    },
                ]}
                type='line'
                width='80%'
                height='400px'
            />
        </Paper>
    )
}

export default ProjectionLineChart
