import { FC, useMemo, useState } from 'react';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box, Paper, Typography } from '@mui/material';

import { toBeginningMonth, toEndMonth } from '../../utils/budgetUtils';

import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { getTransactionsOrderedByDate } from '../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import ActiveBudget from '../../components/ActiveBudget';

import { budget } from '../Budget/Budget';
import PercentageChart from '../Budget/components/PercentageChart';
import { IBudget, IBudgetDatum, ICategoryBreakdown } from '../Budget/Budget.types';

import DateRange from './components/DateRange';

import { IProps } from './BudgetOverview.types';
import { normaliseNum } from '../Budget/BudgetUtils';

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
                    /* This section copied from Budget._categoryBreakdown - refactor and abstract */
                    const categoryBreakdown = transactions[year][month].reduce(
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
                    /* /This section copied from Budget._categoryBreakdown - refactor and abstract */

                    /* This section copied from Budget.res - refactor and abstract */
                    const chart = Object.entries(categoryBreakdown).reduce((acc: IBudgetDatum[], [uid, each]) => {
                        const budgetDatum = monthBudget.budget[Number(uid)];
                        const normalisedValue = normaliseNum(each.value);
            
                        if (budgetDatum?.value) {
                            const numMonths = 1;
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
                    }, []);
                    /* /This section copied from Budget.res - refactor and abstract */

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
