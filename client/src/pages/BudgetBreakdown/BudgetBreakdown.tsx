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

import BudgetTable from './components/BudgetTable';
import DateRange from './components/DateRange';
import PercentageChart from './components/PercentageChart';
import GlanceCards from './components/GlanceCards';
import RadialChart from './components/RadialChart';
import TimeChart from './components/TimeChart';

import { formatNumMonths, formatReadableDate } from './BudgetBreakdownUtils';
import { ICategoryBreakdown } from './BudgetBreakdown.types';

dayjs.extend(localizedFormat)

export const budget: IBudget[] = [
	{
		id: 1,
		name: 'Standard',
		shortDescription: 'My typical day-to-day budget.',
		longDescription: 'My typical day-to-day budget.',
		createdOn: new Date().toString(),
		updatedOn: new Date().toString(),
		budget: {
			1: {
				id: 1,
				categoryId: 1,
				label: 'food',
				value: 200,
				varLowPc: 10,
				varHighPc: 10,
			},
			2: {
				id: 2,
				categoryId: 2,
				label: 'support',
				value: 35,
				varLowPc: 10,
				varHighPc: 10,
			},
			3: {
				id: 3,
				categoryId: 3,
				label: 'travel',
				value: 80,
				varLowPc: 10,
				varHighPc: 10,
			},
			4: {
				id: 4,
				categoryId: 4,
				label: 'health',
				value: 50,
				varLowPc: 10,
				varHighPc: 10,
			},
			5: {
				id: 5,
				categoryId: 5,
				label: 'subscriptions',
				value: 10,
				varLowPc: 10,
				varHighPc: 10,
			},
			6: {
				id: 6,
				categoryId: 6,
				label: 'bike',
				value: 70,
				varLowPc: 10,
				varHighPc: 10,
			},
			7: {
				id: 7,
				categoryId: 7,
				label: 'income',
				value: 0,
				varLowPc: 10,
				varHighPc: 10,
			},
			8: {
				id: 8,
				categoryId: 8,
				label: 'work',
				value: 20,
				varLowPc: 10,
				varHighPc: 10,
			},
			9: {
				id: 9,
				categoryId: 9,
				label: 'phone',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			10: {
				id: 10,
				categoryId: 10,
				label: 'dentist',
				value: 21,
				varLowPc: 10,
				varHighPc: 10,
			},
			11: {
				id: 11,
				categoryId: 11,
				label: 'therapy',
				value: 280,
				varLowPc: 10,
				varHighPc: 10,
			},
			12: {
				id: 12,
				categoryId: 12,
				label: 'home',
				value: 100,
				varLowPc: 10,
				varHighPc: 10,
			},
			13: {
				id: 13,
				categoryId: 13,
				label: 'investment',
				value: 0,
				varLowPc: 10,
				varHighPc: 10,
			},
			14: {
				id: 14,
				categoryId: 14,
				label: 'rent',
				value: 1350,
				varLowPc: 10,
				varHighPc: 10,
			},
			15: {
				id: 15,
				categoryId: 15,
				label: 'gifts',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			16: {
				id: 16,
				categoryId: 16,
				label: 'garden',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			17: {
				id: 17,
				categoryId: 17,
				label: 'clothes',
				value: 30,
				varLowPc: 10,
				varHighPc: 10,
			},
			20: {
				id: 20,
				categoryId: 20,
				label: 'utilities',
				value: 350,
				varLowPc: 0,
				varHighPc: 0,
			},
		},
	},
	{
		id: 2,
		name: 'Just food',
		shortDescription: "Who's idea was it to have a budget with just food?",
		longDescription: 'Nostrud sunt velit ullamco mollit aliquip laboris irure et officia aliquip.',
		createdOn: new Date().toString(),
		updatedOn: new Date().toString(),
		budget: {
			1: {
				id: 1,
				categoryId: 1,
				label: 'food',
				value: 200,
				varLowPc: 10,
				varHighPc: 10,
			},
		},
	},
]

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
