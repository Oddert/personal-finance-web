import { SyntheticEvent, useCallback, useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
    Autocomplete,
    Box,
    Button,
    FormControlLabel,
    TextField,
    Typography,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    getTransactionsEndDate,
    getTransactionsStartDate,
} from '../../../../redux/selectors/transactionsSelectors';

import { conditionallyRefreshTransactions } from '../../../../redux/thunks/transactionThunks';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import {
    getActiveCard,
    getCardResponse,
} from '../../../../redux/selectors/cardSelectors';
import { ICard } from '../../../../types/Card.types';
import { setActiveCard } from '../../../../redux/slices/cardSlice';

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

    const startDate = useAppSelector(getTransactionsStartDate);
    const endDate = useAppSelector(getTransactionsEndDate);
    const cards = useAppSelector(getCardResponse);
    const activeCard = useAppSelector(getActiveCard);

    const handleChangeStart = useCallback((nextValue: Dayjs | null) => {
        setStart(nextValue);
    }, []);

    const handleChangeEnd = useCallback((nextValue: Dayjs | null) => {
        setEnd(nextValue);
    }, []);

    const handleChangeCard = useCallback(
        (event: SyntheticEvent, nextValue: ICard | null) => {
            if (nextValue) {
                dispatch(setActiveCard({ card: nextValue }));
            }
        },
        [dispatch],
    );

    const handleSubmit = useCallback(() => {
        if (start && end) {
            dispatch(
                conditionallyRefreshTransactions(
                    start.valueOf(),
                    end.valueOf(),
                    true,
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
            <Typography
                sx={{ textAlign: 'left', margin: '12px 16px' }}
                variant='h3'
            >
                Load data
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
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
                <FormControlLabel
                    control={
                        <Autocomplete
                            getOptionKey={(option) => option.id}
                            getOptionLabel={(option) => option.cardName}
                            onChange={handleChangeCard}
                            options={cards}
                            renderInput={(props) => <TextField {...props} />}
                            sx={{
                                minWidth: '20vw',
                            }}
                            value={activeCard}
                        />
                    }
                    label='Card'
                    labelPlacement='top'
                    sx={(theme) => ({
                        alignItems: 'flex-start',
                        color: theme.palette.common.white,
                    })}
                />
                <Button
                    onClick={handleSubmit}
                    size='large'
                    sx={{ px: 2, alignSelf: 'flex-end' }}
                >
                    Refresh <RefreshIcon />
                </Button>
            </Box>
        </Box>
    );
};

export default RequestControls;
