import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Button, FormControlLabel, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    getTransactionsEndDate,
    getTransactionsStartDate,
} from '../../../../redux/selectors/transactionsSelectors';

import { conditionallyRefreshTransactions } from '../../../../redux/thunks/transactionThunks';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

dayjs.extend(localizedFormat);

/**
 * Control set to modify the date range and re-request transactions.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const RequestControls = () => {
    const dispatch = useAppDispatch();

    const [start, setStart] = useState<Dayjs | null>(dayjs().startOf('month'));
    const [end, setEnd] = useState<Dayjs | null>(dayjs().endOf('month'));

    const startDate = useSelector(getTransactionsStartDate);
    const endDate = useSelector(getTransactionsEndDate);

    const handleChangeStart = useCallback(
        (nextValue: Dayjs | null) => {
            setStart(nextValue);
        },
        [dispatch],
    );

    const handleChangeEnd = useCallback(
        (nextValue: Dayjs | null) => {
            setEnd(nextValue);
        },
        [dispatch],
    );

    const handleSubmit = useCallback(() => {
        if (start && end) {
            dispatch(
                conditionallyRefreshTransactions(
                    start.valueOf(),
                    end.valueOf(),
                ),
            );
        }
    }, [dispatch, end, start]);

    useEffect(() => {
        const date = dayjs(startDate);
        setStart(date);
    }, [startDate]);

    useEffect(() => {
        const date = dayjs(endDate);
        setEnd(date);
    }, [endDate]);

    return (
        <Box>
            <Typography sx={{ textAlign: 'left', margin: '12px 0' }}>
                Load data for the following dates:
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <FormControlLabel
                    control={
                        <DatePicker
                            label=''
                            name='endDate'
                            onChange={handleChangeStart}
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
                            value={start}
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
                        <DatePicker
                            label=''
                            name='endDate'
                            onChange={handleChangeEnd}
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
                            value={end}
                        />
                    }
                    label='End Date'
                    labelPlacement='top'
                    sx={(theme) => ({
                        alignItems: 'flex-start',
                        color: theme.palette.common.white,
                    })}
                />
                <Button onClick={handleSubmit}>Refresh</Button>
            </Box>
        </Box>
    );
};

export default RequestControls;
