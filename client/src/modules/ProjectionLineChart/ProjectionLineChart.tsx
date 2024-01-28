import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

import { Input, Paper } from '@mui/material'

import {
    // CURRENCY_SYMBOL,
    LOCALE
} from '../../constants/appConstants'
// temp file used for privacy, swap for ../../constants/projectionConstants.ts
import { defaultScenario, scenarioTrimFat } from '../../constants/projectionConstants.temp'

import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors'

import { Transaction } from '../../types/Transaction'

const largeValueFormatter = (number: number) => {
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
    legend: {
        show: true,
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
            formatter: largeValueFormatter,
        },
    },
}

const defaultStart = new Date()
const defaultEnd = new Date()
defaultEnd.setMonth(defaultEnd.getMonth() + 4)
defaultEnd.setDate(0)

// const defaultEnd = '2023-05-31'

const scenarios = [defaultScenario, scenarioTrimFat]

const ProjectionLineChart = () => {
    const [startDate, setStartDate] =
        useState<string|number>(defaultStart.toISOString().substring(0, 10))
    const [endDate, setEndDate] =
        useState<string|number>(defaultEnd.toISOString().substring(0, 10))
    const [startingBallance, setStartingBallance] = useState(0)
    // const [endDate, setEndDate] = useState<string|number>(defaultEnd)

    const [pastBallance, setPastBallance] = useState<{ x: number|string, y: number|string }[]>([])
    const [futureBallance, setFutureBallance] = useState<{ x: number|string, y: number|string }[][]>([])
    
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

    useEffect(() => {
        // NOTE: handle dates in the past, remove startDate?
        if (!pastBallance?.length) {
            return
        }
        // const lastEntry = pastBallance[0]

        const startObj = new Date(startDate)
        const endObj = new Date(endDate)
        console.log(startObj, endObj)

        interface ProjectionTransactionT {
            action: (ballance: number) => number
            label: string
            annotation: string
        }

        const ranges = []

        for (const scenario of scenarios) {
            const actions: { [key: number]: ProjectionTransactionT[] } = {}

            for (const transactor of scenario.transactors) {
                for (const scheduler of transactor.schedulers) {
                    const range = scheduler.getRange(startObj, endObj)
                    for (const date of range) {
                        if (!(date in actions)) {
                            actions[date] = []
                        }
                        actions[date].push({
                            action: transactor.action,
                            label: transactor.description,
                            annotation: transactor.annotation,
                        })
                    }
                }
            }
            const length = Math.abs((startObj.getTime() - endObj.getTime()) / 86400000)
            let runningBallance = Number(startingBallance) // Number(lastEntry.y)
        
            const range = Array.from({ length }, (_, idx) => {
                const localDate = new Date(startObj)
                localDate.setDate(localDate.getDate() + idx)
                const localTime = localDate.getTime()
                const label = []
                if (localTime in actions) {
                    for (const transaction of actions[localTime]) {
                        runningBallance = Math.floor(transaction.action(runningBallance))
                        label.push(`${transaction.label} (${transaction.annotation})`)
                    }
                }
                return { x: localTime, y: runningBallance, label: label.join(', ') }
            })
            ranges.push(range)
        }
        
        setFutureBallance(ranges)
    }, [pastBallance, startingBallance, startDate, endDate])

    console.log(pastBallance, futureBallance)
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
            <Input
                name='start-ballance'
                onChange={(evt) => setStartingBallance(Number(evt.target.value))}
                placeholder='Start Ballance'
                type='number'
                value={startingBallance}
            />
            <Input
                name='start-date'
                onChange={(evt) => setStartDate(evt.target.value)}
                placeholder='Start Date'
                type='date'
                value={startDate}
            />
            <Input
                name='end-date'
                onChange={(evt) => setEndDate(evt.target.value)}
                placeholder='End Date'
                type='date'
                value={endDate}
            />
            <Chart
                options={chart1BaseOptions}
                series={[
                    // {
                    //     name: 'Ballance',
                    //     data: pastBallance,
                    // },
                    ...futureBallance.map((projection, idx) => ({
                        name: scenarios[idx].title,
                        data: projection,
                    }))
                ]}
                type='line'
                width='80%'
                height='400px'
            />
        </Paper>
    )
}

export default ProjectionLineChart
