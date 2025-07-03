import {
    ChangeEvent,
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';

import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

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
} from '@mui/material';
import { ExpandMore as IconExpand } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getFromLocalStore, setToLocalStore } from '../../common/localstore';

import {
    normaliseDateStamp,
    ScheduleByDayOfWeek,
    ScheduleByEvent,
    ScheduleByScalarTime,
    ScheduleBySpecificDay,
} from '../../utils/schedulerUtils';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import { getActiveLanguageCode } from '../../redux/selectors/profileSelectors';
import { getScenarios } from '../../redux/selectors/scenarioSelectors';
import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors';

import type { ITransaction } from '../../types/Transaction.d';

import {
    chart1BaseOptions,
    defaultEnd,
    defaultStart,
    MODULE_PROJECTION_PAST_BALLANCE,
} from './ProjectionLineChartUtils';

dayjs.extend(localizedFormat);

interface IProps {
    compact?: boolean;
}

interface IActiveScenario {
    id: string;
    cardId: string;
    userId: string;
    startDate: string;
    endDate: string;
    createdOn: string;
    updatedOn: string;
    title: string;
    description: string;
    startBallance: number;
    transactors: {
        annotation: string;
        startDate: string;
        description: string;
        action: (value: number) => number;
        schedulers: (
            | ScheduleByEvent
            | ScheduleByDayOfWeek
            | ScheduleByScalarTime
            | ScheduleBySpecificDay
        )[];
    }[];
}

/**
 * Module to display projected expected spend based on the Scenario system.
 * @category Modules
 * @subcategory Projection Line Chart
 * @component
 * @param props.compact If true, displays as a card module for composition with other modules.
 */
const ProjectionLineChart: FC<IProps> = ({ compact = false }) => {
    const { t } = useTranslation();

    const [scenarioOptions, setScenarioOptions] = useState<
        { id: string; label: string }[]
    >([]);

    /**
     * Holds value for the currently selected option(s) for the scenario selector.
     */
    const [activeScenariosOpt, setActiveScenariosOpt] = useState<
        { label: string; id: string }[]
    >([]);

    /**
     * Holds a filtered list of scenarios used to project the chart.
     */
    const [activeScenarios, setActiveScenarios] = useState<IActiveScenario[]>(
        [],
    );

    const [startDate, setStartDate] = useState<Dayjs>(dayjs(defaultStart));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs(defaultEnd));

    const [startingBallance, setStartingBallance] = useState(0);

    const [pastBallance, setPastBallance] = useState<
        { x: number | string; y: number | string }[]
    >([]);
    const [futureBallance, setFutureBallance] = useState<
        { x: number | string; y: number | string }[][]
    >([]);

    const [showHistorical, setShowHistorical] = useState(false);

    const transactions = useAppSelector(getTransactionsOrderedByDate);
    const language = useAppSelector(getActiveLanguageCode);
    const scenarios = useAppSelector(getScenarios);

    const parsedScenarios = useMemo(
        () =>
            scenarios.map((scenario) => ({
                id: '',
                cardId: '',
                userId: '',
                startDate: '',
                endDate: '',
                createdOn: '',
                updatedOn: '',
                title: '',
                description: '',
                startBallance: 0,
                transactors: scenario.transactors.map((transactor) => ({
                    annotation: '',
                    startDate: '',
                    description: '',
                    action: (value: number) =>
                        transactor.isAddition
                            ? value + transactor.value
                            : value - transactor.value,
                    schedulers: transactor.schedulers.map((scheduler) => {
                        switch (scheduler.schedulerCode) {
                            case 'DAY':
                                return new ScheduleBySpecificDay(scheduler.day);
                            case 'DAY_OF_WEEK':
                                return new ScheduleByDayOfWeek(
                                    scheduler.day,
                                    scheduler.nthDay || undefined,
                                );
                            case 'EVENT':
                                return new ScheduleByEvent(
                                    scheduler.startDate || new Date(),
                                );
                            case 'SCALAR':
                            default:
                                return new ScheduleByScalarTime(
                                    scheduler.step || 1,
                                    scheduler.startDate || new Date(),
                                );
                        }
                    }),
                })),
            })),
        [scenarios],
    );

    useEffect(() => {
        setActiveScenarios(parsedScenarios);
        setScenarioOptions(
            parsedScenarios.map((scenario) => ({
                id: scenario.id,
                label: scenario.title,
            })),
        );
    }, [parsedScenarios]);

    const handleScenarioSelection = (
        event: SyntheticEvent<Element, Event>,
        value: {
            label: string;
            id: string;
        }[],
    ) => {
        const ids = value.map(({ id }) => id);
        const filteredScenarios = parsedScenarios.filter((scenario) => {
            return ids.includes(scenario.id);
        });
        setActiveScenarios(filteredScenarios);
        setActiveScenariosOpt(value);
    };

    const handleChangeStartBallance = useCallback(
        (evt: ChangeEvent<HTMLInputElement>) => {
            const val = Number(evt.target.value);
            setStartingBallance(val);
            setToLocalStore(MODULE_PROJECTION_PAST_BALLANCE, val);
        },
        [],
    );

    useEffect(() => {
        setActiveScenariosOpt(scenarioOptions);
        const previousStartBallance = getFromLocalStore(
            MODULE_PROJECTION_PAST_BALLANCE,
        );
        if (previousStartBallance) {
            setStartingBallance(Number(previousStartBallance));
        }
    }, []);

    useEffect(() => {
        const monthSets = Object.values(transactions).reduce(
            (acc: ITransaction[][], yearObj) => {
                const months = Object.values(yearObj);
                return [...acc, ...months];
            },
            [],
        );
        const sampledData = monthSets
            .slice(-3)
            .reduce((acc, monthSet) => [...acc, ...monthSet], []);
        const sampledDataObj = sampledData.reduce(
            (acc: { [key: number]: { x: number; y: number } }, datum) => {
                acc[datum.date] = {
                    x: datum.date,
                    y: datum.ballance,
                };
                return acc;
            },
            {},
        );
        const calculatedPastData = Object.values(sampledDataObj);
        setPastBallance(calculatedPastData);
    }, [transactions]);

    useEffect(() => {
        const startObj = new Date(String(startDate));
        const endObj = new Date(String(endDate));

        interface ProjectionTransactionT {
            action: (ballance: number) => number;
            label: string;
            annotation: string;
        }

        const ranges = [];

        for (const scenario of activeScenarios) {
            const actions: { [key: number]: ProjectionTransactionT[] } = {};

            for (const transactor of scenario.transactors) {
                for (const scheduler of transactor.schedulers) {
                    const range = scheduler.getRange(startObj, endObj);
                    if (scheduler instanceof ScheduleByEvent) {
                    }
                    for (const date of range) {
                        // const date = new Date(d).toString()
                        if (!(date in actions)) {
                            actions[date] = [];
                        }
                        actions[date].push({
                            action: transactor.action,
                            label: transactor.description,
                            annotation: transactor.annotation,
                        });
                        if (scheduler instanceof ScheduleByEvent) {
                        }
                    }
                }
            }
            const length = Math.abs(
                (startObj.getTime() - endObj.getTime()) / 86400000,
            );
            let runningBallance = Number(startingBallance);

            const range = Array.from({ length }, (_, idx) => {
                const localDate = new Date(startObj);
                localDate.setDate(localDate.getDate() + idx);
                const localTime = normaliseDateStamp(localDate);
                const label = [];
                if (localTime in actions) {
                    for (const transaction of actions[localTime]) {
                        runningBallance = Math.floor(
                            transaction.action(runningBallance),
                        );
                        label.push(
                            `${transaction.label} (${transaction.annotation})`,
                        );
                    }
                }
                return {
                    x: localTime,
                    y: runningBallance,
                    label: label.join(', '),
                };
            });
            ranges.push(range);
        }

        setFutureBallance(ranges);
    }, [activeScenarios, startingBallance, startDate, endDate]);

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
                        <TextField {...params} label={t('Active Scenarios')} />
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
                            onChange={(evt) =>
                                setShowHistorical(evt.target.checked)
                            }
                            value={showHistorical}
                        />
                    }
                    label={t('Show Past Data')}
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
                        placeholder={t('Start Ballance')}
                        type='number'
                        value={startingBallance}
                    />
                }
                label={t('Starting Ballance')}
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,
                })}
            />
            <FormControlLabel
                control={
                    <DatePicker
                        name='startDate'
                        onChange={(nextValue) => {
                            if (nextValue) {
                                setStartDate(nextValue);
                            }
                        }}
                        showDaysOutsideCurrentMonth
                        slotProps={{
                            toolbar: {
                                toolbarFormat: 'ddd DD MMMM',
                                hidden: false,
                            },
                        }}
                        sx={{
                            borderRadius: '4px',
                        }}
                        value={startDate}
                    />
                }
                label={t('Start date')}
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,
                })}
            />
            <FormControlLabel
                control={
                    <DatePicker
                        name='endDate'
                        onChange={(nextValue) => {
                            if (nextValue) {
                                setEndDate(nextValue);
                            }
                        }}
                        showDaysOutsideCurrentMonth
                        slotProps={{
                            toolbar: {
                                toolbarFormat: 'ddd DD MMMM',
                                hidden: false,
                            },
                        }}
                        sx={{
                            borderRadius: '4px',
                        }}
                        value={endDate}
                    />
                }
                label={t('End Date')}
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,
                })}
            />
        </Box>
    );

    return (
        <Paper
            elevation={4}
            sx={(theme) => ({
                color: theme.palette.common.black,
                margin: '20px 0 0',
                padding: '20px',
                '& #apexchartsexisting-data-line-chart, & #apexchartscredit-debit-chart':
                    {
                        margin: '0 auto',
                    },
            })}
        >
            {compact ? (
                <Accordion>
                    <AccordionSummary
                        aria-controls='projection-line-controls'
                        expandIcon={<IconExpand />}
                        id='projection-controls-header'
                    >
                        {t('Future Scenario Projection')}
                    </AccordionSummary>
                    <AccordionActions>{Controls}</AccordionActions>
                </Accordion>
            ) : (
                <Box sx={{ width: '80%', margin: '0 auto' }}>
                    <Typography
                        sx={(theme) => ({
                            color: theme.palette.common.white,
                            margin: '16px 0 32px',
                        })}
                        variant='h3'
                    >
                        {t('Future Scenario Projection')}
                    </Typography>
                    {Controls}
                </Box>
            )}
            <Chart
                height='400px'
                options={chart1BaseOptions(compact, language)}
                series={
                    showHistorical
                        ? [
                              {
                                  name: t('Ballance'),
                                  data: pastBallance,
                              },
                              ...futureBallance.map((projection, idx) => ({
                                  name: scenarios[idx].title,
                                  data: projection,
                              })),
                          ]
                        : futureBallance.map((projection, idx) => ({
                              name: scenarios[idx].title,
                              data: projection,
                          }))
                }
                type='line'
                width={compact ? '100%' : '80%'}
            />
        </Paper>
    );
};

export default ProjectionLineChart;
