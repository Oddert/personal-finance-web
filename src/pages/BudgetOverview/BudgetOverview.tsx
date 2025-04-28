import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
    Box,
    Checkbox,
    FormControlLabel,
    Paper,
    Typography,
} from '@mui/material';

import {
    createBudgetChartData,
    createCategoryBreakdown,
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../utils/budgetUtils';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getActiveBudget } from '../../redux/selectors/budgetSelectors';
import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors';
import { requestTransactions } from '../../redux/slices/transactionsSlice';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import ActiveBudget from '../../components/ActiveBudget';
import ActiveCard from '../../components/ActiveCard/ActiveCard';
import BudgetPageToggle from '../../components/BudgetPageToggle';

import AggregateTimeChart from './components/AggregateTimeChart';
import BudgetMonthSpendChart from './components/BudgetMonthSpendChart';
import CandleStickChart from './components/CandleStickChart';
import DateRange from './components/DateRange';
import PercentageCharts from './components/PercentageCharts';
import TimeChart from './components/TimeChart';

import { IBudgetOverviewChart, IProps } from './BudgetOverview.types';

dayjs.extend(localizedFormat);

const defaultStart = toBeginningMonthDayjs(
    String(dayjs().subtract(3, 'months')),
);
const defaultEnd = toEndMonthDayjs(String(dayjs()));

/**
 * Page to provide overview insights into transactions, compared with the active budget, within a selected range.
 *
 * Note: The distinction between what is appropriate for BudgetOverview and {@link BudgetBreakdown} is based on the cognitive context the user may have when looking at the page.
 * As such, the decision on which feature should go where is a judgement call.
 *
 * The intention of each page is as follows:
 * - Budget Overview: Used for comparing comparable spend and discrepancies across a date range. Provides month-to-month insights.
 * - Budget Breakdown: Used to deep-dive into the transactions and discrepancies, identifying insights about why they are out of (or in) range. Primarily intended for a single month but can accept any date range.
 * @category Pages
 * @subcategory Budget Overview
 * @component
 */
const BudgetOverview: FC<IProps> = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigation = useSearchParams();

    const [startDate, setStartDate] = useState<Dayjs>(defaultStart);
    const [endDate, setEndDate] = useState<Dayjs>(defaultEnd);
    const [displayEmptyCats, setDisplayEmptyCats] = useState(true);

    const transactions = useAppSelector(getTransactionsOrderedByDate);
    const categories = useAppSelector(getCategoryOrderedDataById);
    const monthBudget = useAppSelector(getActiveBudget);

    const chartList = useMemo(() => {
        if (monthBudget) {
            let sDate = dayjs(startDate);

            const charts: IBudgetOverviewChart[] = [];

            while (sDate < endDate) {
                const year = sDate.year();
                const month = sDate.month();
                if (year in transactions && month in transactions[year]) {
                    const categoryBreakdown = createCategoryBreakdown(
                        transactions[year][month],
                        categories,
                        displayEmptyCats,
                    );
                    const data = createBudgetChartData(
                        categoryBreakdown,
                        monthBudget,
                        1,
                    );
                    const chart = {
                        timestamp: dayjs(`${year}-${month + 1}-02`),
                        data,
                    };
                    charts.push(chart);
                }
                sDate = sDate.add(1, 'month').set('date', 10);
            }

            return charts;
        }
        return [];
    }, [
        categories,
        displayEmptyCats,
        endDate,
        monthBudget,
        startDate,
        transactions,
    ]);

    useEffect(() => {
        dispatch(
            requestTransactions({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }),
        );
    }, [endDate, startDate]);

    useEffect(() => {
        const start = navigation[0].get('startDate');
        const end = navigation[0].get('endDate');
        if (start) {
            setStartDate(dayjs(start));
            if (end) {
                setEndDate(dayjs(end));
            } else {
                setEndDate(toEndMonthDayjs(start));
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
                    padding: '0 0 64px 0',
                }}
            >
                <Typography variant='h2' sx={{ margin: '32px 0' }}>
                    {t('pageTitles.budgetOverview')}
                </Typography>
                <DateRange
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                />
                <ActiveCard />
                <ActiveBudget />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={displayEmptyCats}
                            onClick={() =>
                                setDisplayEmptyCats(!displayEmptyCats)
                            }
                        />
                    }
                    label={t('Budget.includeEmptyCategories')}
                />
                <PercentageCharts chartList={chartList} />
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
                    <Typography>{t('Budget.monthSpendTitle')}</Typography>
                    <BudgetMonthSpendChart
                        chartList={chartList}
                        startDate={startDate}
                        endDate={endDate}
                    />
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
                    <Typography>{t('Budget.aggregateSpendTitle')}</Typography>
                    <AggregateTimeChart
                        chartList={chartList}
                        endDate={endDate}
                        startDate={startDate}
                    />
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '16px',
                    }}
                >
                    <Typography>{t('Budget.timeChartTitle')}</Typography>
                    <TimeChart
                        chartList={chartList}
                        endDate={endDate}
                        startDate={startDate}
                    />
                </Paper>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        padding: '16px',
                    }}
                >
                    <Typography>{t('Budget.candleStickTitle')}</Typography>
                    <CandleStickChart
                        endDate={endDate}
                        startDate={startDate}
                        transactions={transactions}
                    />
                </Paper>
                <BudgetPageToggle
                    endDate={endDate}
                    mode='overview'
                    startDate={startDate}
                />
            </Box>
        </ResponsiveContainer>
    );
};

export default BudgetOverview;
