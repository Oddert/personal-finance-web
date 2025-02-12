import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';

import { Box, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    ArrowLeft as BackButtonIcon,
    ArrowRight as ForwardButtonIcon,
} from '@mui/icons-material';

import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../utils/budgetUtils';

import type { IProps } from './DateRange.types';
import { useTranslation } from 'react-i18next';

/**
 * Displays date range controls.
 *
 * Includes buttons to jump to the next and previous months (resets range to 1 month).
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const DateRange: FC<IProps> = ({
    endDate,
    setEndDate,
    setStartDate,
    startDate,
}) => {
    const { t } = useTranslation();

    const [dateError, setDateError] = useState<null | string>(null);

    const handleChangeStartDate = useCallback(
        (nextValue: Dayjs | null) => {
            if (nextValue) {
                setStartDate(toBeginningMonthDayjs(nextValue));
                setEndDate(toEndMonthDayjs(nextValue));
                setDateError(null);
            }
        },
        [setEndDate, setStartDate],
    );

    const handleChangeEndDate = useCallback(
        (nextValue: Dayjs | null) => {
            if (nextValue) {
                setEndDate(toBeginningMonthDayjs(nextValue));
                const convertedEndDate = toEndMonthDayjs(nextValue);
                if (convertedEndDate.diff(startDate) < 0) {
                    setDateError(t('modalMessages.unsavedChangesWillBeLost'));
                } else {
                    setDateError(null);
                    setEndDate(convertedEndDate);
                }
            }
        },
        [setEndDate, startDate, t],
    );

    const prevMonth = useMemo(() => {
        const nextDate = startDate.subtract(1, 'month');
        return nextDate;
    }, [startDate]);

    const handleClickPrevMonth = useCallback(() => {
        setStartDate(toBeginningMonthDayjs(prevMonth));
        setEndDate(toEndMonthDayjs(prevMonth));
        setDateError(null);
    }, [prevMonth, setEndDate, setStartDate]);

    const nextMonth = useMemo(() => {
        const nextDate = endDate.add(1, 'month').set('date', 1);
        return nextDate;
    }, [endDate]);

    const handleClickNextMonth = useCallback(() => {
        setStartDate(toBeginningMonthDayjs(String(nextMonth)));
        setEndDate(toEndMonthDayjs(nextMonth));
        setDateError(null);
    }, [nextMonth, setEndDate, setStartDate]);

    return (
        <Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
            >
                <Button onClick={handleClickPrevMonth} variant='contained'>
                    <BackButtonIcon /> {t('commonButtons.prevMonth')} (
                    {prevMonth.format('MMM')} {prevMonth.format('YYYY')})
                </Button>
                <Box>
                    <DatePicker
                        label={t('Start date')}
                        name='startDate'
                        onChange={handleChangeStartDate}
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
                        views={['month', 'year']}
                    />
                    <DatePicker
                        label={t('End date')}
                        name='endDate'
                        onChange={handleChangeEndDate}
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
                        views={['month', 'year']}
                    />
                </Box>
                <Button onClick={handleClickNextMonth} variant='contained'>
                    {t('commonButtons.nextMonth')} ({nextMonth.format('MMM')}{' '}
                    {nextMonth.format('YYYY')}) <ForwardButtonIcon />
                </Button>
            </Box>
            <Typography color='error'>{dateError || ''}</Typography>
        </Fragment>
    );
};

export default DateRange;
