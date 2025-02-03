import { FC, Fragment, useCallback, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../utils/budgetUtils';

import type { IProps } from './DateRange.types';

dayjs.extend(localizedFormat);

/**
 * Date range controls, including buttons to jump to set time periods.
 * @category Pages
 * @subcategory Budget Overview
 * @component
 * @param props.endDate The start date for the date range.
 * @param props.setEndDate Callback function to change the end date.
 * @param props.setStartDate Callback function to change the start date.
 * @param props.startDate The end date for the date range.
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
                const convertedEndDate = toEndMonthDayjs(nextValue);
                if (convertedEndDate.diff(startDate) < 0) {
                    setDateError('End date may not be before start date');
                } else {
                    setDateError(null);
                    setEndDate(toEndMonthDayjs(nextValue));
                }
            }
        },
        [setEndDate, startDate],
    );

    const handleClickTimeJump = (fromDate: Dayjs, toDate: Dayjs) => () => {
        setStartDate(toBeginningMonthDayjs(fromDate));
        setEndDate(toEndMonthDayjs(toDate));
    };

    // const prevMonth = useMemo(() => {
    //     const nextDate = dayjs(startDate).subtract(1, 'month');
    //     return nextDate;
    // }, [startDate])

    // const handleClickPrevMonth = useCallback(() => {
    //     setStartDate(toBeginningMonth(String(prevMonth)));
    //     setEndDate(toEndMonth(String(prevMonth)));
    //     setDateError(null)
    // }, [prevMonth, setEndDate, setStartDate]);

    // const nextMonth = useMemo(() => {
    //     const nextDate = dayjs(endDate).add(1, 'month').set('date', 1);
    //     return nextDate;
    // }, [endDate])

    // const handleClickNextMonth = useCallback(() => {
    //     setStartDate(toBeginningMonth(String(nextMonth)));
    //     setEndDate(toEndMonth(String(nextMonth)));
    //     setDateError(null)
    // }, [nextMonth, setEndDate, setStartDate]);

    return (
        <Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
            >
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
                    value={startDate}
                    views={['month', 'year']}
                />
                <DatePicker
                    label='End date'
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gridGap: '32px',
                }}
            >
                <Button
                    onClick={handleClickTimeJump(
                        dayjs().subtract(7, 'months'),
                        dayjs(),
                    )}
                    variant='contained'
                >
                    Past 6 Months
                </Button>
                <Button
                    onClick={handleClickTimeJump(
                        dayjs().subtract(4, 'months'),
                        dayjs(),
                    )}
                    variant='contained'
                >
                    Past 3 Months
                </Button>
                <Button
                    onClick={handleClickTimeJump(
                        dayjs().subtract(12, 'months'),
                        dayjs(),
                    )}
                    variant='contained'
                >
                    Past 12 Months
                </Button>
                <Button
                    onClick={handleClickTimeJump(
                        dayjs().set('month', 0).subtract(1, 'year'),
                        dayjs().set('month', 11).subtract(1, 'year'),
                    )}
                    variant='contained'
                >
                    Previous Year
                </Button>
                <Button
                    onClick={handleClickTimeJump(
                        dayjs().set('month', 0),
                        dayjs(),
                    )}
                    variant='contained'
                >
                    Current Year
                </Button>
            </Box>
            <Typography color='error'>{dateError || ''}</Typography>
        </Fragment>
    );
};

export default DateRange;
