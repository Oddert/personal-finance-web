import { ChangeEvent, FC, Fragment, useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, TextField, Typography } from '@mui/material';

import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';

import RadialChart from './components/RadialChart';
import CategoryList from './components/CategoryList';

import { ICategoryBreakdown } from './Budget.types';


dayjs.extend(localizedFormat)

const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Given a date in any string format parsable by dayjs.
 *
 * Returns the first day of that month in format YYYY-MM-DD.
 * @param rawDate The date to be flattened.
 * @returns The new date string in standard format.
 */
const toBeginningMonth = (rawDate: string|Date) => {
    const date = dayjs(rawDate).date(1);
    return date.format(DATE_FORMAT);
}

/**
 * Given a date in any string format parsable by dayjs.
 *
 * Returns the last day of that month in format YYYY-MM-DD.
 * @param rawDate The date to be ceilinged.
 * @returns The new date string in standard format.
 */
const toEndMonth = (rawDate: string|Date) => {
    const date = dayjs(rawDate).endOf('month')
    return date.format(DATE_FORMAT);
}

const formatReadableDate = (startDate: string, endDate: string) => {
    const d1 = dayjs(startDate)
    const d2 = dayjs(endDate)
    const format = d1.year() !== d2.year() ? 'dddd D MMMM YYYY' : 'dddd D MMMM';
    return (
        <Fragment>
            <Typography component='span' sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                {d1.format(format)}
            </Typography>
            {' '}to{' '}
            <Typography component='span' sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                {d2.format(format)}
            </Typography>
        </Fragment>
    )
}

const formatNumMonths = (numMonths: number) => {
    return `(${numMonths} ${numMonths > 1 ? 'months' : 'month'})`
}

const Budget: FC = () => {
    const [startDate, setStartDate] = useState(toBeginningMonth(new Date('2024-11-01')));
    const [endDate, setEndDate] = useState(toEndMonth(new Date('2024-11-01')));
    const [dateError, setDateError] = useState<null|string>(null);

    const [numMonths, setNumMonths] = useState(1);
    const [categoryBreakdown, setCategoryBreakdown] = useState<ICategoryBreakdown>({
        uncategorised: {
            label: 'Uncategorised',
            value: 0,
        }
    });

    // const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

    const transactions = useAppSelector(getTransactionsResponse);
    const categories = useAppSelector(getCategoryOrderedDataById);

    const handleChangeStartDate = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setStartDate(toBeginningMonth(e.target.value));
            setEndDate(toEndMonth(e.target.value));
            setDateError(null)
        },
        [],
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
        [startDate],
    );

    useEffect(() => {
        setNumMonths(dayjs(endDate).diff(dayjs(startDate), 'month') + 1);

        const filteredTransactions = transactions.filter((transaction) => {
            const tDate = dayjs(transaction.date)
            const sDate = dayjs(startDate)
            const eDate = dayjs(endDate)
            if (tDate.diff(sDate) >= 0 && tDate.diff(eDate) <= 0) {
                return true
            }
            return false
        });

        const _categoryBreakdown = filteredTransactions.reduce(
            (acc: ICategoryBreakdown, transaction) => {
                if (transaction.category_id && transaction.category_id in categories) {
                    if (!(transaction.category_id in acc)) {
                        acc[transaction.category_id] = {
                            value: 0,
                            label: categories[transaction.category_id].label,
                        };
                    }
                    acc[transaction.category_id].value += transaction.debit;
                } else {
                    acc['uncategorised'].value += transaction.debit;
                }
                return acc;
            },
            { uncategorised: { value: 0, label: 'Uncategorised' } },
        );
        setCategoryBreakdown(_categoryBreakdown);
    }, [categories, endDate, startDate, transactions]);

    return (
        <ResponsiveContainer>
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                {formatReadableDate(startDate, endDate)} {formatNumMonths(numMonths)}
            </Typography>
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
            <Typography color='error'>{dateError || ''}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                }}
            >
                <CategoryList categoryBreakdown={categoryBreakdown} />
                <RadialChart categoryBreakdown={categoryBreakdown} />
            </Box>
        </ResponsiveContainer>
    )
}

export default Budget;
