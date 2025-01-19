import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import {Box, Paper, Typography } from '@mui/material';

import type { ICategoryBreakdown } from '../../types/Category';
import type { Transaction } from '../../types/Transaction';

import { createBudgetChartData, createCategoryBreakdown, toBeginningMonth, toEndMonth } from '../../utils/budgetUtils';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getTransactionsResponse } from '../../redux/selectors/transactionsSelectors';
import { getActiveBudget } from '../../redux/selectors/budgetSelectors';

import ActiveBudget from '../../components/ActiveBudget';
import BudgetPageToggle from '../../components/BudgetPageToggle';

import BudgetTable from './components/BudgetTable';
import DateRange from './components/DateRange';
import PercentageChart from './components/PercentageChart';
import GlanceCards from './components/GlanceCards';
import RadialChart from './components/RadialChart';
import TimeChart from './components/TimeChart';

import { formatNumMonths, formatReadableDate } from './BudgetBreakdownUtils';

dayjs.extend(localizedFormat)

/**
 * Page to provide detailed insights into transactions, compared with the active budget, within a selected range.
 *
 * Note: The distinction between what is appropriate for BudgetBreakdown and {@link BudgetOverview} is based on the cognitive context the user may have when looking at the page.
 * As such, the decision on which feature should go where is a judgement call.
 *
 * The intention of each page is as follows:
 * - Budget Overview: Used for comparing comparable spend and discrepancies across a date range. Provides month-to-month insights.
 * - Budget Breakdown: Used to deep-dive into the transactions and discrepancies, identifying insights about why they are out of (or in) range. Primarily intended for a single month but can accept any date range.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const BudgetBreakdown: FC = () => {
    const navigation = useSearchParams()

    const [startDate, setStartDate] = useState(toBeginningMonth(new Date('2024-11-01')));
    const [endDate, setEndDate] = useState(toEndMonth(new Date('2024-11-01')));
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

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
	const monthBudget = useAppSelector(getActiveBudget);

    const data = useMemo(() => {
		if (monthBudget) {
			const _data = createBudgetChartData(categoryBreakdown, monthBudget, numMonths)
			return _data
		}
		return [];
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
                <ActiveBudget />
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-around',
                    }}
                >
                    <PercentageChart
						data={data}
						endDate={endDate}
						startDate={startDate}
					/>
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
