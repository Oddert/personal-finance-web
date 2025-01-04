import { FC, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { toBeginningMonth, toEndMonth } from '../../utils/budgetUtils';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import DateRange from './components/DateRange';

import { IProps } from './BudgetOverview.types';

const BudgetOverview: FC<IProps> = () => {
    const [startDate, setStartDate] = useState(toBeginningMonth(new Date('2024-11-01')));
    const [endDate, setEndDate] = useState(toEndMonth(new Date('2024-11-01')));
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
                    Budget Overview
                </Typography>
                <DateRange
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                />
                {/* <ActiveBudget
                    monthBudget={monthBudget}
                    setMonthBudget={setMonthBudget}
                /> */}
                {/* <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-around',
                    }}
                >
                    <PercentageChart data={data} />
                    <RadialChart categoryBreakdown={categoryBreakdown} />
                </Paper> */}
                {/* <GlanceCards
                    data={data}
                    monthBudget={monthBudget}
                /> */}
                {/* <Paper
                    elevation={0}
                >
                    <BudgetTable data={data} />
                </Paper> */}
                {/* <Paper
                    elevation={0}
                >
                    <TimeChart
                        endDate={endDate}
                        filteredTransactions={filteredTransactions}
                        startDate={startDate}
                    />
                </Paper> */}
            </Box>
        </ResponsiveContainer>
    )
}

export default BudgetOverview;
