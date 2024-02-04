import { ChangeEvent, FC, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'

import {
    Accordion,
    AccordionActions,
    AccordionSummary,
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    Input,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import { ExpandMore as ExpandIcon } from '@mui/icons-material'

import { getFromLocalStore, setToLocalStore } from '../../common/localstore'

import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors'

import { Transaction } from '../../types/Transaction'

import {
    chart1BaseOptions,
    defaultEnd,
    defaultStart,
    MODULE_PROJECTION_PAST_BALLANCE,
    scenarioOptions,
    scenarios,
    title,
} from './ProjectionLineChartUtils'

interface Props {
    compact?: boolean
}

/**
 * Shows future expected transactions based on Scenarios.
 * @component
 */
const ProjectionLineChart: FC<Props> = ({ compact = false }) => {
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

    const handleChangeStartBallance = useCallback(
        (evt: ChangeEvent<HTMLInputElement>) => {
            const val = Number(evt.target.value)
            setStartingBallance(val)
            setToLocalStore(MODULE_PROJECTION_PAST_BALLANCE, val)
        },
        [],
    )

    useEffect(() => {
        setActiveScenariosOpt(scenarioOptions)
        const previousStartBallance = getFromLocalStore(
            MODULE_PROJECTION_PAST_BALLANCE,
        )
        if (previousStartBallance) {
            setStartingBallance(Number(previousStartBallance))
        }
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

    const Controls = (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gridColumn: '1 / -1',
                }}
            >
                <Autocomplete
                    multiple
                    onChange={handleScenarioSelection}
                    options={scenarioOptions}
                    renderInput={(params) => (
                        <TextField {...params} label='Active Scenarios' />
                    )}
                    sx={{
                        flex: 1,
                    }}
                    value={activeScenariosOpt}
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
            </Box>
            <FormControlLabel
                control={
                    <Input
                        name='start-ballance'
                        onChange={handleChangeStartBallance}
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
        </Box>
    )

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
            {
                compact ? (
                    <Accordion>
                        <AccordionSummary
                            aria-controls='projection-line-controls'
                            expandIcon={<ExpandIcon />}
                            id='projection-controls-header'
                        >
                            {title}
                        </AccordionSummary>
                        <AccordionActions>
                            {Controls}
                        </AccordionActions>
                    </Accordion>
                ) : (
                    <Box sx={{ width: '80%', margin: '0 auto' }}>
                        <Typography
                            sx={(theme) => ({ color: theme.palette.common.white })}
                            variant='h3'
                        >
                            {title}
                        </Typography>
                        {Controls}
                    </Box>
                )
            }
            <Chart
                options={chart1BaseOptions(compact)}
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
                width={compact ? '100%' : '80%'}
                height='400px'
            />
        </Paper>
    )
}

export default ProjectionLineChart
