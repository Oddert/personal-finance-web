import { FC, useState } from 'react';

import { Box, Button, ListItem, Typography } from '@mui/material';
import { Add as PlusIcon } from '@mui/icons-material'

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { IDynamicCardLayoutModes } from '../../types/Common.types';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import { budget as tempBudgets } from '../BudgetBreakdown/BudgetBreakdown';

import BudgetCard from './components/BudgetCard';

import { IProps } from './ManageBudgets.types';


const ManageBudgets: FC<IProps> = () => {
	const [layout, setLayout] = useState<IDynamicCardLayoutModes>('standard');

	const handleDialogOpen = () => {}

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
					Budgets
				</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '0 8px',
					}}
				>
					<LayoutControls layout={layout} setLayout={setLayout} />
					<Button onClick={handleDialogOpen} variant='contained'>
						<PlusIcon /> Create new budget
					</Button>
				</Box>
				<DynamicCardList layout={layout}>
					{tempBudgets.map((budget, idx) => (
						<BudgetCard budget={budget} key={idx} />
					))}
					<ListItem>
						<Button
							onClick={handleDialogOpen}
							sx={{
								width: '100%',
								height: '100%',
							}}
							title='Create a new budget'
							variant='outlined'
						>
							<PlusIcon fontSize='large' />
						</Button>
					</ListItem>
				</DynamicCardList>
			</Box>
		</ResponsiveContainer>
	);
}

export default ManageBudgets;
