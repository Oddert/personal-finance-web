import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormControlLabel, Paper, Switch, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { IProps } from './ProjectionChart.types';
import type { TAggregateDatapoints } from '../../../../types/Transaction.d';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../../../redux/selectors/cardSelectors';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import APIService from '../../../../services/APIService';
import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../utils/budgetUtils';

import Display from './components/Display/Display';

dayjs.extend(localizedFormat);
const ProjectionChart: FC<IProps> = ({ previewMode }) => {
    const [pastData, setPastData] = useState<TAggregateDatapoints>({});
    const [pastDataLoading, setPastDataLoading] = useState(false);
    const [showNegatives, setShowNegatives] = useState(true);
    const [startDate, setStartDate] = useState(
        toBeginningMonthDayjs(dayjs().subtract(24, 'months')),
    );
    const [endDate, setEndDate] = useState(toEndMonthDayjs(new Date()));

    const cardId = useAppSelector(getActiveCardId);

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const theme = useTheme();

    useEffect(() => {
        if (!cardId?.length) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPastDataLoading(true);

        const fetchPastData = async () => {
            try {
                const pastDataResponse =
                    await APIService.getAllTransactionsAggregated(cardId, {
                        startDate: startDate.valueOf(),
                        endDate: endDate.valueOf(),
                    });
                if (!pastDataResponse.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setPastData(pastDataResponse.payload.transactions);
            } catch (error) {
                dispatch(intakeError(error));
            } finally {
                setPastDataLoading(false);
            }
        };

        fetchPastData();
    }, [dispatch, t, cardId, startDate, endDate]);

    if (previewMode === 'off') {
        return null;
    }

    return (
        <Paper
            sx={{
                color: theme.palette.common.black,
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
            </Box>
            <Display
                disableCategoryBreakdown={previewMode === 'total'}
                loading={pastDataLoading}
                pastData={pastData}
                showNegatives={showNegatives}
            />
        </Paper>
    );
};

export default ProjectionChart;
