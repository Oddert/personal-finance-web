import { FC, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, Paper, Typography } from '@mui/material';

import { createBudgetChartData, createCategoryBreakdown, toBeginningMonth, toEndMonth } from '../../utils/budgetUtils';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import ActiveBudget from '../../components/ActiveBudget';
import PercentageChart from '../../components/BudgetPercentageChart';

import { budget } from '../Budget/Budget';
import { IBudget, IBudgetDatum } from '../Budget/Budget.types';

import DateRange from './components/DateRange';

import { IProps } from './BudgetOverview.types';

dayjs.extend(localizedFormat);

const BudgetOverview: FC<IProps> = () => {
    const [startDate, setStartDate] = useState(toBeginningMonth(new Date('2024-11-01')));
    const [endDate, setEndDate] = useState(toEndMonth(new Date('2024-11-01')));
    const [monthBudget, setMonthBudget] = useState<IBudget>(budget[0]);

    const transactions = useAppSelector(getTransactionsOrderedByDate);
    const categories = useAppSelector(getCategoryOrderedDataById);
    
    const data = useMemo(() => {
        const sDate = dayjs(startDate);
        const eDate = dayjs(endDate);

        const charts: IBudgetDatum[][] = [];

        for (let year = sDate.year(); year < eDate.year(); year++) {
            for (let month = 0; month < 12; month++) {
                if (year in transactions && month in transactions[year]) {
                    const categoryBreakdown = createCategoryBreakdown(transactions[year][month], categories);
                    const chart = createBudgetChartData(categoryBreakdown, monthBudget, 1);
                    charts.push(chart);
                }
            }
        }

        return charts
    }, [categories, endDate, monthBudget, startDate, transactions]);

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
                    Budget Overview
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
                    {data.map((monthData) => (
                        <PercentageChart data={monthData} />
                    ))}
                </Paper>
            </Box>
        </ResponsiveContainer>
    )
}

export default BudgetOverview;
