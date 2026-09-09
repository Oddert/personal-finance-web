/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { ICard } from '../../../../types/Card.types';

import ExportTransactions from '../../../../components/ExportTransactions';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../redux/selectors/cardSelectors';
import {
    getTransactionsEndDate,
    getTransactionsStartDate,
} from '../../../../redux/selectors/transactionsSelectors';
import { refreshTransactions } from '../../../../redux/thunks/transactionThunks';

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
    const [allCards, setAllCards] = useState(true);
    const [activeCards, setActiveCards] = useState<ICard[]>([]);

    const startDate = useAppSelector(getTransactionsStartDate);
    const endDate = useAppSelector(getTransactionsEndDate);
    const cards = useAppSelector(getCardResponse);

    const handleChangeStart = useCallback((nextValue: Dayjs | null) => {
        setStart(nextValue);
    }, []);

    const handleChangeEnd = useCallback((nextValue: Dayjs | null) => {
        setEnd(nextValue);
    }, []);

    const handleSubmit = useCallback(() => {
        if (start && end) {
            dispatch(refreshTransactions(allCards ? [] : [], start, end));
        }
    }, [allCards, dispatch, end, start]);

    useEffect(() => {
        if (startDate) {
            const date = dayjs(startDate);
            setStart(date);
        } else {
            setStart(dayjs().startOf('month'));
        }
    }, [startDate]);

    useEffect(() => {
        if (endDate) {
            const date = dayjs(endDate);
            setEnd(date);
        } else {
            setEnd(dayjs().endOf('month'));
        }
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
                            format='DD/MM/YYYY'
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
                        mx: 0,
                    })}
                />
                <FormControlLabel
                    control={
                        <DatePicker
                            format='DD/MM/YYYY'
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
                        mx: 0,
                    })}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allCards}
                            onChange={(_, checked) => {
                                setAllCards(checked);
                            }}
                        />
                    }
                    label='All cards'
                    labelPlacement='top'
                    sx={{
                        mx: 0,
                    }}
                />
                <FormControlLabel
                    control={
                        <Autocomplete
                            disabled={allCards}
                            fullWidth
                            getOptionKey={(opt) => opt.id}
                            getOptionLabel={(opt) => opt.cardName}
                            multiple
                            onChange={(_, value) => {
                                setActiveCards(value);
                            }}
                            options={cards}
                            renderInput={(props) => <TextField {...props} />}
                            value={activeCards}
                        />
                    }
                    label={t('literals.Card')}
                    labelPlacement='top'
                    sx={(theme) => ({
                        alignItems: 'flex-start',
                        color: theme.palette.common.white,
                        mx: 0,
                        minWidth: '250px',
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
                    defaultCards={activeCards}
                    defaultEndDate={endDate}
                    defaultStartDate={startDate}
                    defaultUseAllCards={allCards}
                />
            </Box>
        </Box>
    );
};

export default RequestControls;
