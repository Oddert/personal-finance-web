import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    ArrowLeft as BackButtonIcon,
    ArrowRight as ForwardButtonIcon,
} from '@mui/icons-material';

import { toBeginningMonth, toEndMonth } from '../../../../utils/budgetUtils';

import type { IProps } from './DateRange.types';

dayjs.extend(localizedFormat);

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
    const [dateError, setDateError] = useState<null | string>(null);

    const handleChangeStartDate = useCallback(
        (nextValue: Dayjs | null) => {
            if (nextValue) {
                setStartDate(toBeginningMonth(nextValue));
                setEndDate(toEndMonth(nextValue));
                setDateError(null);
            }
        },
        [setEndDate, setStartDate],
    );

    const handleChangeEndDate = useCallback(
        (nextValue: Dayjs | null) => {
            if (nextValue) {
                setEndDate(toBeginningMonth(nextValue));
                const convertedEndDate = toEndMonth(nextValue);
                if (dayjs(convertedEndDate).diff(dayjs(startDate)) < 0) {
                    setDateError('End date may not be before start date');
                } else {
                    setDateError(null);
                    setEndDate(convertedEndDate);
                }
            }
        },
        [setEndDate, startDate],
    );

    const prevMonth = useMemo(() => {
        const nextDate = dayjs(startDate).subtract(1, 'month');
        return nextDate;
    }, [startDate]);

    const handleClickPrevMonth = useCallback(() => {
        setStartDate(toBeginningMonth(prevMonth));
        setEndDate(toEndMonth(prevMonth));
        setDateError(null);
    }, [prevMonth, setEndDate, setStartDate]);

    const nextMonth = useMemo(() => {
        const nextDate = dayjs(endDate).add(1, 'month').set('date', 1);
        return nextDate;
    }, [endDate]);

    const handleClickNextMonth = useCallback(() => {
        setStartDate(toBeginningMonth(String(nextMonth)));
        setEndDate(toEndMonth(nextMonth));
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
                    <BackButtonIcon /> Previous Month ({prevMonth.format('MMM')}{' '}
                    {prevMonth.format('YYYY')})
                </Button>
                <Box>
                    <DatePicker
                        label='Start date'
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
                        value={dayjs(startDate)}
                        views={['month', 'year']}
                    />
                    <DatePicker
                        label='Start date'
                        name='startDate'
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
                        value={dayjs(endDate)}
                        views={['month', 'year']}
                    />
                </Box>
                <Button onClick={handleClickNextMonth} variant='contained'>
                    Next Month ({nextMonth.format('MMM')}{' '}
                    {nextMonth.format('YYYY')}) <ForwardButtonIcon />
                </Button>
            </Box>
            <Typography color='error'>{dateError || ''}</Typography>
        </Fragment>
    );
};

export default DateRange;
