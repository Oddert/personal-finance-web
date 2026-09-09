import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OpenInNew as IconExternalLink } from '@mui/icons-material';
import { Box, FormControlLabel, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import LF from 'dayjs/plugin/localizedFormat';

import type { IProps } from './DateFormat.type';

dayjs.extend(LF);

export const DateFormat: FC<IProps> = ({
    localDateFormat,
    setLocalDateFormat,
}) => {
    const { t } = useTranslation();

    const [date, setDate] = useState(dayjs());
    const [formatError, setFormatError] = useState<string>('');

    const validateDateFormat = (format: string): boolean => {
        if (!format) {
            setFormatError('');
            return true;
        }
        try {
            // Try to format a date with the provided format
            const testDate = dayjs('2024-01-15');
            const formatted = testDate.format(format);
            // Check if the result is a non-empty string
            if (!formatted || formatted.includes('undefined')) {
                setFormatError(
                    t('Transaction.invalidDateFormat') || 'Invalid date format',
                );
                return false;
            }
            setFormatError('');
            return true;
        } catch {
            setFormatError(
                t('Transaction.invalidDateFormat') || 'Invalid date format',
            );
            return false;
        }
    };

    return (
        <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography sx={{ marginBottom: '24px' }} variant='h4'>
                {t('Transaction.changeDateFormat')}
            </Typography>
            <Typography
                component={'a'}
                href='https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens'
                sx={{ display: 'flex', alignItems: 'center' }}
                target='_blank'
            >
                {t('Transaction.viewDateReference')}{' '}
                <IconExternalLink
                    sx={{ width: '16px', height: '16px', ml: 1 }}
                />
            </Typography>
            <Box sx={{ display: 'flex', my: 2 }}>
                <FormControlLabel
                    control={
                        <TextField
                            error={!!formatError}
                            fullWidth
                            helperText={formatError}
                            onChange={(event) => {
                                setLocalDateFormat(event.target.value);
                                validateDateFormat(event.target.value);
                            }}
                            placeholder='DD/MM/YYYY'
                            value={localDateFormat}
                        />
                    }
                    label={t('literals.Format')}
                    labelPlacement='top'
                    sx={{ flex: 1 }}
                />
                <Box sx={{ flex: 2 }}>
                    <Typography>{t('literals.Example')}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gridGap: '12px',
                        }}
                    >
                        <DatePicker
                            name='example_date'
                            onChange={(value) => {
                                if (value) {
                                    setDate(value);
                                }
                            }}
                            showDaysOutsideCurrentMonth
                            slotProps={{
                                toolbar: {
                                    toolbarFormat: 'ddd DD MMMM',
                                    hidden: false,
                                },
                            }}
                            value={date}
                        />
                        <Typography>=</Typography>
                        <Typography
                            sx={{
                                ml: 1,
                                justifyContent: 'center',
                                fontSize: '24px',
                            }}
                        >
                            &ldquo;{' '}
                            <Typography
                                component={'span'}
                                sx={{
                                    fontWeight: 'bold',
                                    letterSpacing: '2px',
                                }}
                            >
                                {date.format(localDateFormat)}
                            </Typography>{' '}
                            &rdquo;
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DateFormat;
