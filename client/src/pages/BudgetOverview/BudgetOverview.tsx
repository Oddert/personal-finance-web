import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';

import {
    createBudgetChartData,
    createCategoryBreakdown,
    toBeginningMonth,
    toEndMonth,
} from '../../utils/budgetUtils';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getActiveBudget } from '../../redux/selectors/budgetSelectors';
import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import ActiveBudget from '../../components/ActiveBudget';
import BudgetPageToggle from '../../components/BudgetPageToggle';

import AggregateTimeChart from './components/AggregateTimeChart';
import DateRange from './components/DateRange';
import PercentageCharts from './components/PercentageCharts';
import TimeChart from './components/TimeChart';

import { IBudgetOverviewChart, IProps } from './BudgetOverview.types';

dayjs.extend(localizedFormat);

const defaultStart = toBeginningMonth(String(dayjs().subtract(12, 'months')))
const defaultEnd = toEndMonth(String(dayjs()))

const BudgetOverview: FC<IProps> = () => {
    const navigation = useSearchParams();

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
	const [displayEmptyCats, setDisplayEmptyCats] = useState(true);

    const transactions = useAppSelector(getTransactionsOrderedByDate);
    const categories = useAppSelector(getCategoryOrderedDataById);
	const monthBudget = useAppSelector(getActiveBudget);
    
    const chartList = useMemo(() => {
		if (monthBudget) {
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
                <ActiveBudget />
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
                    <Typography>
                        Aggregate % Spend Discrepancy
                    </Typography>
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
                    <Typography>
                        Spend Discrepancy & Trend Per Month
                    </Typography>
                    <TimeChart
                        chartList={chartList}
                        endDate={endDate}
                        startDate={startDate}
                    />
                </Paper>
                <BudgetPageToggle
                    endDate={endDate}
                    mode='overview'
                    startDate={startDate}
                />
            </Box>
        </ResponsiveContainer>
    )
}

export default BudgetOverview;
