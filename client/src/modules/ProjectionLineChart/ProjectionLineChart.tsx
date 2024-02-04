import { SyntheticEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'

import { Autocomplete, Checkbox, FormControlLabel, Input, Paper, TextField } from '@mui/material'

// temp file used for privacy, swap for ../../constants/projectionConstants.ts
import { defaultScenario, newBike, scenarioTrimFat } from '../../constants/projectionConstants.temp'

import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors'

import { Transaction } from '../../types/Transaction'

import { chart1BaseOptions } from './ProjectionLineChartUtils'

const defaultStart = new Date()
const defaultEnd = new Date()
defaultEnd.setMonth(defaultEnd.getMonth() + 4)
defaultEnd.setDate(0)

const scenarios = [defaultScenario, scenarioTrimFat, newBike]
const scenarioOptions = scenarios.map(
    (scenario, idx) => ({ label: scenario.title, id: idx }),
)

/**
 * Shows future expected transactions based on Scenarios.
 * @component
 */
const ProjectionLineChart = () => {
    const [activeScenariosOpt, setActiveScenariosOpt] =
        useState<{ label: string; id: number; }[]>(scenarioOptions)

    const [activeScenarios, setActiveScenarios] = useState(scenarios)

    const [startDate, setStartDate] =
        useState<string|number>(defaultStart.toISOString().substring(0, 10))

    const [endDate, setEndDate] =
        useState<string|number>(defaultEnd.toISOString().substring(0, 10))

    const [startingBallance, setStartingBallance] = useState(0)

    const [pastBallance, setPastBallance] = useState<{ x: number|string, y: number|string }[]>([])
    const [futureBallance, setFutureBallance] = useState<{ x: number|string, y: number|string }[][]>([])

    const [showHistorical, setShowHistorical] = useState(false)
    
    const transactions = useSelector(getTransactionsOrderedByDate)

    const handleScenarioSelection = (
        event: SyntheticEvent<Element, Event>,
        value: {
            label: string;
            id: number;
        }[]
    ) => {
        const ids = value.map(({ id }) => id)
        setActiveScenarios(
            scenarios.filter((scenario) => ids.includes(scenario.id))
        )
        setActiveScenariosOpt(value)
    }

    useEffect(() => {
        setActiveScenariosOpt(scenarioOptions)
    }, [])

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
        setStartingBallance(calculatedPastData[calculatedPastData.length - 1].y)
    }, [transactions])

    useEffect(() => {
        const startObj = new Date(startDate)
        const endObj = new Date(endDate)

        interface ProjectionTransactionT {
            action: (ballance: number) => number
            label: string
            annotation: string
        }

        const ranges = []

        for (const scenario of activeScenarios) {
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
            let runningBallance = Number(startingBallance)

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
    }, [activeScenarios, startingBallance, startDate, endDate])

    return (
        <Paper
            elevation={4}
            sx={(theme) => ({
                color: theme.palette.common.black,
                margin: '20px 0 0',
                padding: '20px',
                '& #apexchartsexisting-data-line-chart, & #apexchartscredit-debit-chart': {
                    margin: '0 auto',
                },
            })}
        >
            <FormControlLabel
                control={
                    <Input
                        name='start-ballance'
                        onChange={(evt) => setStartingBallance(Number(evt.target.value))}
                        placeholder='Start Ballance'
                        type='number'
                        value={startingBallance}
                    />
                }
                label='Starting Ballance'
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,   
                })}
            />
            <FormControlLabel
                control={
                    <Input
                        name='start-date'
                        onChange={(evt) => setStartDate(evt.target.value)}
                        placeholder='Start Date'
                        type='date'
                        value={startDate}
                    />
                }
                label='Start Date'
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,   
                })}
            />
            <FormControlLabel
                control={
                    <Input
                        name='end-date'
                        onChange={(evt) => setEndDate(evt.target.value)}
                        placeholder='End Date'
                        type='date'
                        value={endDate}
                    />
                }
                label='End Date'
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,   
                })}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name='show-historical'
                        onChange={(evt) => setShowHistorical(evt.target.checked)}
                        value={showHistorical}
                    />
                }
                label='Show Past Data'
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,   
                })}
            />
            <Autocomplete
                multiple
                onChange={handleScenarioSelection}
                options={scenarioOptions}
                renderInput={(params) => <TextField {...params} label='Active Scenarios' />}
                value={activeScenariosOpt}
            />
            <Chart
                options={chart1BaseOptions}
                series={
                    showHistorical
                        ? [
                            {
                                name: 'Ballance',
                                data: pastBallance,
                            },
                            ...futureBallance.map((projection, idx) => ({
                                name: scenarios[idx].title,
                                data: projection,
                            }))
                        ]
                        : futureBallance.map(
                            (projection, idx) => ({
                                name: scenarios[idx].title,
                                data: projection,
                            })
                        )
                }
                type='line'
                width='80%'
                height='400px'
            />
        </Paper>
    )
}

export default ProjectionLineChart
