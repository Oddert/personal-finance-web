import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import {Box, Paper, Typography } from '@mui/material';

import { Transaction } from '../../types/Transaction';

import { createBudgetChartData, createCategoryBreakdown, toBeginningMonth, toEndMonth } from '../../utils/budgetUtils';

import { IBudget } from '../../types/Budget.types';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors';

import ActiveBudget from '../../components/ActiveBudget';
import BudgetPageToggle from '../../components/BudgetPageToggle';
import PercentageChart from '../../components/BudgetPercentageChart';

import BudgetTable from './components/BudgetTable';
import DateRange from './components/DateRange';
import GlanceCards from './components/GlanceCards';
import RadialChart from './components/RadialChart';
import TimeChart from './components/TimeChart';

import { formatNumMonths, formatReadableDate } from './BudgetBreakdownUtils';
import { ICategoryBreakdown } from './BudgetBreakdown.types';

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
            value: 50,
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
            value: 280,
            varLowPc: 10,
            varHighPc: 10,
        },
        12: {
            label: 'home',
            value: 100,
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
            value: 1350,
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
        20: {
            label: 'utilities',
            value: 350,
            varLowPc: 0,
            varHighPc: 0,
        },
    }
}]

const BudgetBreakdown: FC = () => {
    const navigation = useSearchParams()

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
        const _data = createBudgetChartData(categoryBreakdown, monthBudget, numMonths)
        return _data
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

        const _categoryBreakdown = createCategoryBreakdown(_filteredTransactions, categories);
        setCategoryBreakdown(_categoryBreakdown);
        setFilteredTransactions(_filteredTransactions);
    }, [categories, endDate, startDate, transactions]);

    useEffect(() => {
        const start = navigation[0].get('startDate');
        const end = navigation[0].get('endDate');
        if (start) {
            setStartDate(start);
            if (end) {
                setEndDate(end);
            } else {
                setEndDate(toEndMonth(start));
            }
        }
    }, [navigation]);

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
					numMonths={numMonths}
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
                <BudgetPageToggle
                    endDate={endDate}
                    mode='breakdown'
                    startDate={startDate}
                />
            </Box>
        </ResponsiveContainer>
    )
}

export default BudgetBreakdown;
