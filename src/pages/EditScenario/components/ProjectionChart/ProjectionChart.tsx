import { type FC, Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    Input,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { IProps } from './ProjectionChart.types';
import type { ICard } from '../../../../types/Card.types';
import type { IScheduler } from '../../../../types/Scenario.types';
import type { TAggregateDataResponse } from '../../../../types/Transaction.d';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../redux/selectors/cardSelectors';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import APIService from '../../../../services/APIService';
import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../utils/budgetUtils';
import {
    ScheduleByDayOfWeek,
    ScheduleByEvent,
    ScheduleByScalarTime,
    ScheduleBySpecificDay,
} from '../../../../utils/schedulerUtils';

import Display from './components/Display/Display';

dayjs.extend(localizedFormat);

/**
 * Displays a preview of aggregated historical data to provide context to the user while they model a new Scenario.
 */
const ProjectionChart: FC<IProps> = ({
    previewMode,
    scenario,
    splitOnCards,
    transactors,
}) => {
    const [pastData, setPastData] = useState<TAggregateDataResponse>([]);
    const [pastDataLoading, setPastDataLoading] = useState(false);
    const [showNegatives, setShowNegatives] = useState(true);
    const [startDate, setStartDate] = useState(
        toBeginningMonthDayjs(dayjs().subtract(3, 'months')),
    );
    const [endDate, setEndDate] = useState(toEndMonthDayjs(new Date()));
    const [selectedCards, setSelectedCards] = useState<ICard[]>([]);
    const [allCardsActive, setAllCardsActive] = useState(true);
    const [projectionMonths, setProjectionMonths] = useState(3);

    const cards = useAppSelector(getCardResponse);

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const projectionData = useMemo<TAggregateDataResponse>(() => {
        if (!pastData.length || projectionMonths < 1) {
            return [];
        }

        const projectionStart = endDate.add(1, 'month').startOf('month');
        const schedules = (scheduler: IScheduler) => {
            switch (scheduler.schedulerCode) {
                case 'DAY':
                    return new ScheduleBySpecificDay(scheduler.day ?? 1);
                case 'DAY_OF_WEEK':
                    return new ScheduleByDayOfWeek(
                        scheduler.day ?? 0,
                        scheduler.nthDay ?? undefined,
                    );
                case 'EVENT':
                    return new ScheduleByEvent(
                        scheduler.startDate ?? projectionStart.toDate(),
                    );
                case 'SCALAR':
                default:
                    return new ScheduleByScalarTime(
                        scheduler.step ?? 1,
                        scheduler.startDate ?? projectionStart.toDate(),
                    );
            }
        };

        return pastData.map((card) => {
            let balance =
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                card.transactions[endDate.format('YYYY-MM')]?.finalBalance;
            if (balance === undefined) {
                const monthRecords = Object.values(card.transactions);
                balance =
                    monthRecords[monthRecords.length - 1]?.finalBalance ??
                    scenario.startBallance;
            }
            let projectedBalance = balance;
            const transactions = Object.fromEntries(
                Array.from({ length: projectionMonths }, (_, index) => {
                    const month = projectionStart.add(index, 'month');
                    const monthKey = month.format('YYYY-MM');
                    const monthEnd = month.endOf('month');
                    for (const transactor of transactors) {
                        for (const scheduler of transactor.schedulers ?? []) {
                            for (const date of schedules(scheduler).getRange(
                                projectionStart.toDate(),
                                monthEnd.toDate(),
                            )) {
                                if (
                                    date >= month.startOf('month').valueOf() &&
                                    date <= monthEnd.valueOf()
                                ) {
                                    projectedBalance += transactor.isAddition
                                        ? transactor.value
                                        : -transactor.value;
                                }
                            }
                        }
                    }
                    return [
                        monthKey,
                        {
                            data: [],
                            totalCredit: 0,
                            totalDebit: 0,
                            finalBalance: projectedBalance,
                        },
                    ];
                }),
            );
            return { cardId: card.cardId, transactions };
        });
    }, [
        endDate,
        pastData,
        projectionMonths,
        scenario.startBallance,
        transactors,
    ]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCards(cards);
    }, [cards]);

    useEffect(() => {
        if (!selectedCards.length) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPastDataLoading(true);

        const fetchPastData = async () => {
            try {
                const pastDataResponse =
                    await APIService.getAllTransactionsAggregated(
                        selectedCards.map((card) => card.id).join(','),
                        {
                            startDate: startDate.toISOString(),
                            endDate: endDate.toISOString(),
                        },
                    );
                if (!pastDataResponse.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setPastData(pastDataResponse.payload.cards);
            } catch (error) {
                dispatch(intakeError(error));
            } finally {
                setPastDataLoading(false);
            }
        };

        fetchPastData();
    }, [dispatch, t, startDate, endDate, selectedCards]);

    if (previewMode === 'off') {
        return null;
    }

    return (
        <Paper
            sx={{
                margin: '20px 0 0',
                padding: '20px',
            }}
        >
            <Box sx={{ display: 'flex', gridGap: '16px' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showNegatives}
                            onChange={(_, checked) => {
                                setShowNegatives(checked);
                            }}
                        />
                    }
                    label='Include income'
                    sx={(theme) => ({
                        color: theme.palette.primary.contrastText,
                    })}
                />

                <DatePicker
                    label={t('Start date')}
                    name='startDate'
                    onChange={(nextValue) => {
                        if (nextValue) {
                            setStartDate(toBeginningMonthDayjs(nextValue));
                        }
                    }}
                    showDaysOutsideCurrentMonth
                    slotProps={{
                        toolbar: {
                            toolbarFormat: 'ddd DD MMMM',
                            hidden: false,
                        },
                        textField: {
                            size: 'small',
                        },
                    }}
                    sx={{
                        borderRadius: '4px',
                    }}
                    value={startDate}
                    views={['month', 'year']}
                />
                <DatePicker
                    label={t('End date')}
                    name='endDate'
                    onChange={(nextValue) => {
                        if (nextValue) {
                            const nextEndDate = toEndMonthDayjs(nextValue);
                            if (startDate > nextEndDate) {
                                setStartDate(toBeginningMonthDayjs(nextValue));
                            }
                            setEndDate(nextEndDate);
                        }
                    }}
                    showDaysOutsideCurrentMonth
                    slotProps={{
                        toolbar: {
                            toolbarFormat: 'ddd DD MMMM',
                            hidden: false,
                        },
                        textField: {
                            size: 'small',
                        },
                    }}
                    sx={{
                        borderRadius: '4px',
                    }}
                    value={endDate}
                    views={['month', 'year']}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allCardsActive}
                            onChange={(_, checked) => {
                                setAllCardsActive(checked);
                            }}
                        />
                    }
                    label='All cards'
                    labelPlacement='end'
                />
                <Autocomplete
                    disabled={allCardsActive}
                    getOptionKey={(opt) => opt.id}
                    getOptionLabel={(opt) => opt.cardName}
                    multiple
                    onChange={(_, value) => {
                        setSelectedCards(value);
                    }}
                    options={cards}
                    renderInput={(props) => (
                        <TextField {...props} size='small' />
                    )}
                    value={selectedCards}
                />
                <FormControlLabel
                    control={
                        <Input
                            inputProps={{ min: 1, max: 24 }}
                            onChange={(event) => {
                                const value = Number(event.target.value);
                                if (Number.isFinite(value)) {
                                    setProjectionMonths(
                                        Math.min(24, Math.max(1, value)),
                                    );
                                }
                            }}
                            size='small'
                            type='number'
                            value={projectionMonths}
                        />
                    }
                    label='Projection months'
                    labelPlacement='top'
                />
            </Box>
            <Box>
                {splitOnCards ? (
                    pastData.map((card) => {
                        const foundCard = cards.find(
                            (c) => c.id === card.cardId,
                        );
                        return (
                            <Fragment key={card.cardId}>
                                <Typography sx={{ mt: 2, mb: 2 }} variant='h3'>
                                    {foundCard?.cardName ?? card.cardId}
                                </Typography>
                                <Display
                                    clipPrefix={card.cardId}
                                    compact
                                    disableCategoryBreakdown={
                                        previewMode === 'total'
                                    }
                                    loading={pastDataLoading}
                                    pastData={[card]}
                                    projectedData={projectionData.filter(
                                        (projectedCard) =>
                                            projectedCard.cardId ===
                                            card.cardId,
                                    )}
                                    showNegatives={showNegatives}
                                />
                            </Fragment>
                        );
                    })
                ) : (
                    <Display
                        clipPrefix='all-cards'
                        disableCategoryBreakdown={previewMode === 'total'}
                        loading={pastDataLoading}
                        pastData={pastData}
                        projectedData={projectionData}
                        showNegatives={showNegatives}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default ProjectionChart;
