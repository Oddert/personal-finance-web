import { ChangeEvent, FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, TextField, Typography } from '@mui/material';

import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';

import BudgetTable from './components/BudgetTable';
import PercentageChart from './components/PercentageChart';
import RadialChart from './components/RadialChart';

import { IBudgetDatum, ICategoryBreakdown } from './Budget.types';

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

const normalise = (value: number) => Number(value.toFixed(2));

const monthBudget: { [key: number]: { label: string, value: number } } = {
    1: {
        label: 'food',
        value: 200,
    },
    2: {
        label: 'support',
        value: 35,
    },
    3: {
        label: 'travel',
        value: 80,
    },
    4: {
        label: 'health',
        value: 200,
    },
    5: {
        label: 'subscriptions',
        value: 10,
    },
    6: {
        label: 'bike',
        value: 70,
    },
    7: {
        label: 'income',
        value: 0,
    },
    8: {
        label: 'work',
        value: 20,
    },
    9: {
        label: 'phone',
        value: 30,
    },
    10: {
        label: 'dentist',
        value: 20,
    },
    11: {
        label: 'therapy',
        value: 240,
    },
    12: {
        label: 'home',
        value: 200,
    },
    13: {
        label: 'investment',
        value: 0,
    },
    14: {
        label: 'rent',
        value: 1150,
    },
    15: {
        label: 'gifts',
        value: 30,
    },
    16: {
        label: 'garden',
        value: 30,
    },
    17: {
        label: 'clothes',
        value: 30,
    },
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
            colour: '#bec3c7',
        }
    });

    // const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

    const transactions = useAppSelector(getTransactionsResponse);
    const categories = useAppSelector(getCategoryOrderedDataById);

    const data = useMemo(() => {
        const res = Object.entries(categoryBreakdown).reduce((acc: IBudgetDatum[], [uid, each]) => {
            const budgetDatum = monthBudget[Number(uid)];
            const normalisedValue = normalise(each.value);

            if (budgetDatum?.value) {
                const budgetValue = numMonths * budgetDatum.value;
                const diffInt = normalise(normalisedValue - budgetValue);
                const diffPc = normalise((diffInt / budgetValue) * 100);
                acc.push({
                    categoryName: each.label,
                    budget: budgetDatum.value,
                    spend: Number(each.value.toFixed(2)),
                    diffInt,
                    diffPc,
                });
            } else {
                acc.push({
                    categoryName: each.label,
                    budget: 0,
                    spend: normalisedValue,
                    diffInt: 0,
                    diffPc: 0,
                });
            }

            return acc
        }, [])
        return res
    }, [categoryBreakdown, numMonths]);

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
                            colour: categories[transaction.category_id].colour,
                        };
                    }
                    acc[transaction.category_id].value += transaction.debit;
                } else {
                    acc['uncategorised'].value += transaction.debit;
                }
                return acc;
            },
            { uncategorised: { value: 0, label: 'Uncategorised', colour: '#bec3c7' } },
        );
        setCategoryBreakdown(_categoryBreakdown);
    }, [categories, endDate, startDate, transactions]);

    return (
        <ResponsiveContainer>
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                Budget from {formatReadableDate(startDate, endDate)} {formatNumMonths(numMonths)}
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
                {/* <CategoryList categoryBreakdown={categoryBreakdown} /> */}
                <PercentageChart data={data} />
                <RadialChart categoryBreakdown={categoryBreakdown} />
            </Box>
            <Typography>
                Total expected spend: {
                    Object.values(monthBudget).reduce(
                        (a, e) => a + e.value,
                        0,
                    )
                }
            </Typography>
            <Typography>
                Total actual spend: {
                    normalise(
                        Object.values(data).reduce(
                            (acc, each) => acc + each.spend,
                            0,
                        )
                    )
                }
            </Typography>
            <BudgetTable data={data} />
        </ResponsiveContainer>
    )
}

export default Budget;
