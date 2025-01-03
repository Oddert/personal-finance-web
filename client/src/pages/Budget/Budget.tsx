import { FC, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import {Box, Paper, Typography } from '@mui/material';

import { Transaction } from '../../types/Transaction';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors';

import BudgetTable from './components/BudgetTable';
import DateRange from './components/DateRange';
import GlanceCards from './components/GlanceCards';
import PercentageChart from './components/PercentageChart';
import RadialChart from './components/RadialChart';
import TimeChart from './components/TimeChart';

import {
    formatNumMonths,
    formatReadableDate,
    normaliseNum,
    toBeginningMonth,
    toEndMonth,
} from './BudgetUtils';
import { IBudget, IBudgetDatum, ICategoryBreakdown } from './Budget.types';
import ActiveBudget from './components/ActiveBudget';

dayjs.extend(localizedFormat)

export const budget: IBudget[] = [{
    id: 1,
    name: 'Standard',
    budget: {
        1: {
            label: 'food',
            value: 200,
            varLowPc: 10,
            varHighPc: 10,
        },
        2: {
            label: 'support',
            value: 35,
            varLowPc: 10,
            varHighPc: 10,
        },
        3: {
            label: 'travel',
            value: 80,
            varLowPc: 10,
            varHighPc: 10,
        },
        4: {
            label: 'health',
            value: 200,
            varLowPc: 10,
            varHighPc: 10,
        },
        5: {
            label: 'subscriptions',
            value: 10,
            varLowPc: 10,
            varHighPc: 10,
        },
        6: {
            label: 'bike',
            value: 70,
            varLowPc: 10,
            varHighPc: 10,
        },
        7: {
            label: 'income',
            value: 0,
            varLowPc: 10,
            varHighPc: 10,
        },
        8: {
            label: 'work',
            value: 20,
            varLowPc: 10,
            varHighPc: 10,
        },
        9: {
            label: 'phone',
            value: 30,
            varLowPc: 10,
            varHighPc: 10,
        },
        10: {
            label: 'dentist',
            value: 21,
            varLowPc: 10,
            varHighPc: 10,
        },
        11: {
            label: 'therapy',
            value: 240,
            varLowPc: 10,
            varHighPc: 10,
        },
        12: {
            label: 'home',
            value: 200,
            varLowPc: 10,
            varHighPc: 10,
        },
        13: {
            label: 'investment',
            value: 0,
            varLowPc: 10,
            varHighPc: 10,
        },
        14: {
            label: 'rent',
            value: 1150,
            varLowPc: 10,
            varHighPc: 10,
        },
        15: {
            label: 'gifts',
            value: 30,
            varLowPc: 10,
            varHighPc: 10,
        },
        16: {
            label: 'garden',
            value: 30,
            varLowPc: 10,
            varHighPc: 10,
        },
        17: {
            label: 'clothes',
            value: 30,
            varLowPc: 10,
            varHighPc: 10,
        },
    }
}]

const Budget: FC = () => {
    const [startDate, setStartDate] = useState(toBeginningMonth(new Date('2024-11-01')));
    const [endDate, setEndDate] = useState(toEndMonth(new Date('2024-11-01')));
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [monthBudget, setMonthBudget] = useState<IBudget>(budget[0])

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
            const budgetDatum = monthBudget.budget[Number(uid)];
            const normalisedValue = normaliseNum(each.value);

            if (budgetDatum?.value) {
                const budgetValue = numMonths * budgetDatum.value;
                const diffFloat = normaliseNum(normalisedValue - budgetValue);
                const diffPc = normaliseNum((diffFloat / budgetValue) * 100);
                acc.push({
                    budget: budgetDatum.value,
                    categoryName: each.label,
                    diffFloat,
                    diffPc,
                    spend: Number(each.value.toFixed(2)),
                    variance: [budgetDatum.varLowPc, budgetDatum.varHighPc],
                });
            } else {
                acc.push({
                    budget: 0,
                    categoryName: each.label,
                    diffFloat: 0,
                    diffPc: 0,
                    spend: normalisedValue,
                    variance: [0, 0],
                });
            }

            return acc
        }, [])
        return res
    }, [categoryBreakdown, monthBudget, numMonths]);

    useEffect(() => {
        setNumMonths(dayjs(endDate).diff(dayjs(startDate), 'month') + 1);

        const _filteredTransactions = transactions.filter((transaction) => {
            const tDate = dayjs(transaction.date)
            const sDate = dayjs(startDate)
            const eDate = dayjs(endDate)
            if (tDate.diff(sDate) >= 0 && tDate.diff(eDate) <= 0) {
                return true
            }
            return false
        });

        const _categoryBreakdown = _filteredTransactions.reduce(
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
        setFilteredTransactions(_filteredTransactions);
    }, [categories, endDate, startDate, transactions]);

    return (
        <ResponsiveContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                }}
            >
                <Typography variant='h2' sx={{ margin: '32px 0' }}>
                    Budget from {formatReadableDate(startDate, endDate)} {formatNumMonths(numMonths)}
                </Typography>
                <DateRange
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                />
                <ActiveBudget
                    monthBudget={monthBudget}
                    setMonthBudget={setMonthBudget}
                />
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-around',
                    }}
                >
                    <PercentageChart data={data} />
                    <RadialChart categoryBreakdown={categoryBreakdown} />
                </Paper>
                <GlanceCards
                    data={data}
                    monthBudget={monthBudget}
                />
                <Paper
                    elevation={0}
                >
                    <BudgetTable data={data} />
                </Paper>
                <Paper
                    elevation={0}
                >
                    <TimeChart
                        endDate={endDate}
                        filteredTransactions={filteredTransactions}
                        startDate={startDate}
                    />
                </Paper>
            </Box>
        </ResponsiveContainer>
    )
}

export default Budget;
