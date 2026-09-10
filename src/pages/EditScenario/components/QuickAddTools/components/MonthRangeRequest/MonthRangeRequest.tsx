import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import LF from 'dayjs/plugin/localizedFormat';

import type { IProps } from './MonthRangeRequest.types';

import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../../../utils/budgetUtils';

dayjs.extend(LF);

const MonthRangeRequest: FC<IProps> = ({ loading, onClickLoad }) => {
    const { t } = useTranslation();

    const [endDate, setEndDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(dayjs());

    const handleClick = () => {
        onClickLoad(startDate, endDate);
    };

    useEffect(() => {
        const todayLastMonth = dayjs().subtract(1, 'month');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStartDate(toBeginningMonthDayjs(todayLastMonth));
        setEndDate(toEndMonthDayjs(todayLastMonth));
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                views={['year', 'month', 'day']}
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
                views={['year', 'month', 'day']}
            />
            <Button
                disabled={loading}
                onClick={handleClick}
                variant='contained'
            >
                {loading ? <CircularProgress /> : t('literals.Search')}
            </Button>
        </Box>
    );
};

export default MonthRangeRequest;
