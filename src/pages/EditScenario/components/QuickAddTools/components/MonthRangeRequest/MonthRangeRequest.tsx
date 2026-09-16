import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import LF from 'dayjs/plugin/localizedFormat';

import type { IProps } from './MonthRangeRequest.types';
import type { ICard } from '../../../../../../types/Card.types';

import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../../../redux/selectors/cardSelectors';
import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../../../utils/budgetUtils';
import { ffBlankCard } from '../../../../../../utils/factoryFunctions';

dayjs.extend(LF);

const ENUM_ALL_CARDS = 'ENUM_ALL_CARDS';

const optionAllCards = ffBlankCard({
    cardName: '- All Cards -',
    id: ENUM_ALL_CARDS,
});

const MonthRangeRequest: FC<IProps> = ({ loading, onClickLoad }) => {
    const { t } = useTranslation();

    const [endDate, setEndDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(dayjs());
    const [cards, setCards] = useState<ICard[]>([optionAllCards]);

    const allCards = useAppSelector(getCardResponse);

    const handleClick = () => {
        const allCards = cards.find((card) => card.id === ENUM_ALL_CARDS);
        onClickLoad(
            startDate,
            endDate,
            allCards || !cards.length ? null : cards.map((c) => c.id).join(','),
        );
    };

    useEffect(() => {
        const todayLastMonth = dayjs().subtract(1, 'month');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStartDate(toBeginningMonthDayjs(todayLastMonth));
        setEndDate(toEndMonthDayjs(todayLastMonth));
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gridGap: '4px',
            }}
        >
            <DatePicker
                format='DD/MM/YYYY'
                label={t('Start date')}
                name='startDate'
                onChange={(nextValue) => {
                    if (nextValue) {
                        setStartDate(toBeginningMonthDayjs(nextValue));
                    }
                }}
                showDaysOutsideCurrentMonth
                slotProps={{
                    textField: {
                        size: 'small',
                    },
                    toolbar: {
                        toolbarFormat: 'ddd DD MMMM',
                        hidden: false,
                    },
                }}
                sx={{
                    borderRadius: '4px',
                }}
                value={startDate}
                views={['year', 'month']}
            />
            <DatePicker
                format='DD/MM/YYYY'
                label={t('End date')}
                name='endDate'
                onChange={(nextValue) => {
                    if (nextValue) {
                        const nextEndDate = toEndMonthDayjs(nextValue);
                        if (startDate > nextEndDate) {
                            setStartDate(toEndMonthDayjs(nextValue));
                        }
                        setEndDate(nextEndDate);
                    }
                }}
                showDaysOutsideCurrentMonth
                slotProps={{
                    textField: {
                        size: 'small',
                    },
                    toolbar: {
                        toolbarFormat: 'ddd DD MMMM',
                        hidden: false,
                    },
                }}
                sx={{
                    borderRadius: '4px',
                }}
                value={endDate}
                views={['year', 'month']}
            />
            <Autocomplete
                getOptionKey={(opt) => opt.id}
                getOptionLabel={(opt) => opt.cardName}
                multiple
                onChange={(_, value) => {
                    setCards(value);
                }}
                options={[optionAllCards, ...allCards]}
                renderInput={(props) => (
                    <TextField
                        {...props}
                        label={t('literals.Card')}
                        size='small'
                    />
                )}
                renderOption={(props) => (
                    // @ts-expect-error assume errant report
                    <Chip {...props} size='small' />
                )}
                // sx={{ '& .MuiChip-root': { m: 0 } }}
                value={cards}
            />
            <Button
                disabled={loading}
                onClick={handleClick}
                variant='contained'
            >
                {loading ? (
                    <CircularProgress size='1rem' />
                ) : (
                    t('literals.Search')
                )}
            </Button>
        </Box>
    );
};

export default MonthRangeRequest;
