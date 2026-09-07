/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import CardSelector from '../../../../components/CardSelector';
import ExportTransactions from '../../../../components/ExportTransactions';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import {
    getTransactionsEndDate,
    getTransactionsStartDate,
} from '../../../../redux/selectors/transactionsSelectors';
import { conditionallyRefreshTransactions } from '../../../../redux/thunks/transactionThunks';

dayjs.extend(localizedFormat);

/**
 * Control set to modify the date range and re-request transactions.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const RequestControls = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [start, setStart] = useState<Dayjs | null>(dayjs().startOf('month'));
    const [end, setEnd] = useState<Dayjs | null>(dayjs().endOf('month'));

    const startDate = useAppSelector(getTransactionsStartDate);
    const endDate = useAppSelector(getTransactionsEndDate);

    const handleChangeStart = useCallback((nextValue: Dayjs | null) => {
        setStart(nextValue);
    }, []);

    const handleChangeEnd = useCallback((nextValue: Dayjs | null) => {
        setEnd(nextValue);
    }, []);

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
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                }}
            >
                <FormControlLabel
                    control={
                        <DatePicker
                            label=''
                            name='startDate'
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
                    label={t('End date')}
                    labelPlacement='top'
                    sx={(theme) => ({
                        alignItems: 'flex-start',
                        color: theme.palette.common.white,
                    })}
                />
                <FormControlLabel
                    control={<CardSelector />}
                    label={t('literals.Card')}
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
                    variant='contained'
                >
                    {t('Load data')}
                </Button>
            </Box>
            <Box sx={{ my: 2 }}>
                <ExportTransactions
                    defaultEndDate={endDate}
                    defaultStartDate={startDate}
                />
            </Box>
        </Box>
    );
};

export default RequestControls;
