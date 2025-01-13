import { FC } from 'react';

import { Box, List, Paper, Typography } from '@mui/material';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { IProps } from './ManageBudgets.types';

import DynamicCardList from '../../components/DynamicCardList';

import { budget as tempBudgets } from '../BudgetBreakdown/BudgetBreakdown';

const ManageBudgets: FC<IProps> = () => {
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
					Manage Budgets
				</Typography>
				<DynamicCardList layout='standard'>
					{tempBudgets.map((budget, idx) => (
						<List key={idx}>
							<Paper>
								<Typography>{budget.name}</Typography>
								<Typography>{budget.shortDescription}</Typography>
								<Typography>Last updated: {budget.updatedOn}</Typography>
							</Paper>
						</List>
					))}
				</DynamicCardList>
			</Box>
		</ResponsiveContainer>
	);
}

export default ManageBudgets;
