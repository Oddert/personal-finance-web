import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Paper, Typography } from '@mui/material';

import type { ICategoryBreakdown } from '../../types/Category.d';

import {
    createBudgetChartData,
    createCategoryBreakdown,
    DATE_FORMAT,
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../utils/budgetUtils';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';
import useTransactions from '../../hooks/useTransactions';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getActiveBudget } from '../../redux/selectors/budgetSelectors';

import ActiveBudget from '../../components/ActiveBudget';
import ActiveCard from '../../components/ActiveCard/ActiveCard';
import BudgetPageToggle from '../../components/BudgetPageToggle';

import BudgetMonthSpendChart from './components/BudgetMonthSpendChart';
import BudgetTable from './components/BudgetTable';
import DateRange from './components/DateRange';
import PercentageChart from './components/PercentageChart';
import GlanceCards from './components/GlanceCards';
import RadialChart from './components/RadialChart';
import TimeChart from './components/TimeChart';

import { formatNumMonths, formatReadableDate } from './BudgetBreakdownUtils';

dayjs.extend(localizedFormat);

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
    const navigation = useSearchParams();

    const [startDate, setStartDate] = useState<Dayjs>(
        toBeginningMonthDayjs(new Date('2024-11-01')),
    );
    const [endDate, setEndDate] = useState<Dayjs>(
        toEndMonthDayjs(new Date('2024-11-01')),
    );

    const [numMonths, setNumMonths] = useState(1);
    const [categoryBreakdown, setCategoryBreakdown] =
        useState<ICategoryBreakdown>({
            uncategorised: {
                label: 'Uncategorised',
                value: 0,
                colour: '#bec3c7',
            },
        });

    const { transactions } = useTransactions(startDate, endDate);
    const categories = useAppSelector(getCategoryOrderedDataById);
    const monthBudget = useAppSelector(getActiveBudget);

    const data = useMemo(() => {
        if (monthBudget) {
            const nextData = createBudgetChartData(
                categoryBreakdown,
                monthBudget,
                numMonths,
            );
            return nextData;
        }
        return [];
    }, [categoryBreakdown, monthBudget, numMonths]);

    useEffect(() => {
        setNumMonths(endDate.diff(startDate, 'month') + 1);

        const nextCategoryBreakdown = createCategoryBreakdown(
            transactions,
            categories,
        );
        setCategoryBreakdown(nextCategoryBreakdown);
    }, [categories, endDate, startDate, transactions]);

    useEffect(() => {
        const start = navigation[0].get('startDate');
        const end = navigation[0].get('endDate');
        if (start) {
            setStartDate(toBeginningMonthDayjs(start));
            if (end) {
                setEndDate(toEndMonthDayjs(end));
            } else {
                setEndDate(toEndMonthDayjs(start));
            }
        }
    }, []);

    return (
        <ResponsiveContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                }}
            >
                <Typography variant='h2' sx={{ margin: '32px 0 0' }}>
                    Budget breakdown
                </Typography>
                <Typography variant='h3' sx={{ margin: '0 0 32px' }}>
                    from{' '}
                    {formatReadableDate(
                        startDate.format(DATE_FORMAT),
                        endDate.format(DATE_FORMAT),
                    )}{' '}
                    {formatNumMonths(numMonths)}
                </Typography>
                <DateRange
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                />
                <ActiveCard />
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
                    sx={{
                        padding: '16px',
                    }}
                >
                    <BudgetTable data={data} />
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        padding: '16px',
                    }}
                >
                    <Typography>Aggregate spend chart</Typography>
                    <TimeChart
                        endDate={endDate}
                        filteredTransactions={transactions}
                        startDate={startDate}
                    />
                </Paper>
                {numMonths > 1 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            padding: '16px',
                        }}
                    >
                        <Typography>Category spend across period</Typography>
                        <BudgetMonthSpendChart
                            endDate={endDate}
                            filteredTransactions={transactions}
                            startDate={startDate}
                        />
                    </Paper>
                ) : null}
                <BudgetPageToggle
                    endDate={endDate}
                    mode='breakdown'
                    startDate={startDate}
                />
            </Box>
        </ResponsiveContainer>
    );
};

export default BudgetBreakdown;
