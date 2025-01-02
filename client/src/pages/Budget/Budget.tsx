import { FC, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, Typography } from '@mui/material';

import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';

import BudgetTable from './components/BudgetTable';
import DateRange from './components/DateRange';
import PercentageChart from './components/PercentageChart';
import RadialChart from './components/RadialChart';

import { IBudgetDatum, ICategoryBreakdown } from './Budget.types';
import {
    formatNumMonths,
    formatReadableDate,
    normaliseNum,
    toBeginningMonth,
    toEndMonth,
} from './BudgetUtils';

dayjs.extend(localizedFormat)

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

    const [numMonths, setNumMonths] = useState(1);
    const [categoryBreakdown, setCategoryBreakdown] = useState<ICategoryBreakdown>({
        uncategorised: {
            label: 'Uncategorised',
            value: 0,
            colour: '#bec3c7',
        }
    });

    const transactions = useAppSelector(getTransactionsResponse);
    const categories = useAppSelector(getCategoryOrderedDataById);

    const data = useMemo(() => {
        const res = Object.entries(categoryBreakdown).reduce((acc: IBudgetDatum[], [uid, each]) => {
            const budgetDatum = monthBudget[Number(uid)];
            const normalisedValue = normaliseNum(each.value);

            if (budgetDatum?.value) {
                const budgetValue = numMonths * budgetDatum.value;
                const diffInt = normaliseNum(normalisedValue - budgetValue);
                const diffPc = normaliseNum((diffInt / budgetValue) * 100);
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
            <DateRange
                endDate={endDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                startDate={startDate}
            />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                }}
            >
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
                    normaliseNum(
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
