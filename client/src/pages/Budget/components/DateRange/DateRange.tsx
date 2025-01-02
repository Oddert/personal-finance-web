import { ChangeEvent, FC, Fragment, useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, Button, TextField, Typography } from '@mui/material';
import {
    ArrowLeft as BackButtonIcon,
    ArrowRight as ForwardButtonIcon,
} from '@mui/icons-material';

import { toBeginningMonth, toEndMonth } from '../../BudgetUtils';

import { IProps } from './DateRange.types';

dayjs.extend(localizedFormat)

const DateRange: FC<IProps> = ({ endDate, setEndDate, setStartDate, startDate }) => {
    const [dateError, setDateError] = useState<null|string>(null);

    const handleChangeStartDate = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setStartDate(toBeginningMonth(e.target.value));
            setEndDate(toEndMonth(e.target.value));
            setDateError(null)
        },
        [setEndDate, setStartDate],
    );

    const handleChangeEndDate = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const convertedEndDate = toEndMonth(e.target.value);
            if (dayjs(convertedEndDate).diff(dayjs(startDate)) < 0) {
                setDateError('End date may not be before start date');
            } else {
                setDateError(null)
                setEndDate(toEndMonth(e.target.value))
            }
        },
        [setEndDate, startDate],
    );

    const prevMonth = useMemo(() => {
        const nextDate = dayjs(startDate).subtract(1, 'month');
        return nextDate;
    }, [startDate])

    const handleClickPrevMonth = useCallback(() => {
        setStartDate(toBeginningMonth(String(prevMonth)));
        setEndDate(toEndMonth(String(prevMonth)));
        setDateError(null)
    }, [prevMonth, setEndDate, setStartDate]);

    const nextMonth = useMemo(() => {
        const nextDate = dayjs(endDate).add(1, 'month').set('date', 1);
        return nextDate;
    }, [endDate])

    const handleClickNextMonth = useCallback(() => {
        setStartDate(toBeginningMonth(String(nextMonth)));
        setEndDate(toEndMonth(String(nextMonth)));
        setDateError(null)
    }, [nextMonth, setEndDate, setStartDate]);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <Button
                    onClick={handleClickPrevMonth}
                    variant='contained'
                >
                    <BackButtonIcon />{' '}
                    Previous Month{' '}
                    ({prevMonth.format('MMM')} {prevMonth.format('YYYY')})
                </Button>
                <Box>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label='Start Date'
                        name='startDate'
                        onChange={handleChangeStartDate}
                        type='date'
                        value={startDate}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label='End Date'
                        name='endDate'
                        onChange={handleChangeEndDate}
                        type='date'
                        value={endDate}
                    />
                </Box>
                <Button
                    onClick={handleClickNextMonth}
                    variant='contained'
                >
                    Next Month{' '}
                    ({nextMonth.format('MMM')} {nextMonth.format('YYYY')}){' '}
                    <ForwardButtonIcon />
                </Button>
            </Box>
            <Typography color='error'>{dateError || ''}</Typography>
        </Fragment>
    )
}

export default DateRange;
