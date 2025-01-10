import { FC, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';

import {
    createBudgetChartData,
    createCategoryBreakdown,
    toBeginningMonth,
    toEndMonth,
} from '../../utils/budgetUtils';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors';

import { IBudget } from '../../types/Budget.types';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import ActiveBudget from '../../components/ActiveBudget';

import { budget } from '../Budget/Budget';

import AggregateTimeChart from './components/AggregateTimeChart';
import DateRange from './components/DateRange';
import PercentageCharts from './components/PercentageCharts';
import TimeChart from './components/TimeChart';

import { IBudgetOverviewChart, IProps } from './BudgetOverview.types';

dayjs.extend(localizedFormat);

const defaultStart = toBeginningMonth(String(dayjs().subtract(12, 'months')))
const defaultEnd = toEndMonth(String(dayjs()))

const BudgetOverview: FC<IProps> = () => {
    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [monthBudget, setMonthBudget] = useState<IBudget>(budget[0]);
	const [displayEmptyCats, setDisplayEmptyCats] = useState(true);

    const transactions = useAppSelector(getTransactionsOrderedByDate);
    const categories = useAppSelector(getCategoryOrderedDataById);
    
    const chartList = useMemo(() => {
        let sDate = dayjs(startDate);
        const eDate = dayjs(endDate);

        const charts: IBudgetOverviewChart[] = [];

		while (sDate < eDate) {
			const year = sDate.year()
			const month = sDate.month()
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
				}
				charts.push(chart);
			}
			sDate = sDate.add(1, 'month').set('date', 10)
		}

        return charts
    }, [
		categories,
		displayEmptyCats,
		endDate,
		monthBudget,
		startDate,
		transactions,
	]);

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
				<FormControlLabel
					control={
						<Checkbox
							checked={displayEmptyCats}
							onClick={() => setDisplayEmptyCats(!displayEmptyCats)}
						/>
					}
					label='Include empty categories'
				/>
                <PercentageCharts
					chartList={chartList}
				/>
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
                    <Typography>Aggregate % Spend Discrepancy</Typography>
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
                    <Typography>Spend Discrepancy & Trend Per Month</Typography>
                    <TimeChart
                        chartList={chartList}
                        endDate={endDate}
                        startDate={startDate}
                    />
                </Paper>
            </Box>
        </ResponsiveContainer>
    )
}

export default BudgetOverview;
