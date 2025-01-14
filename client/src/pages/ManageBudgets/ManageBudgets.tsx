import { FC, useState } from 'react';

import { Box, Button, Chip, ListItem, Paper, Typography } from '@mui/material';
import {
	Add as PlusIcon,
	ArrowForward as RightArrowIcon,
} from '@mui/icons-material'

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { IDynamicCardLayoutModes } from '../../types/Common.types';

import { LOCALE } from '../../constants/appConstants';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import { budget as tempBudgets } from '../BudgetBreakdown/BudgetBreakdown';

import { IProps } from './ManageBudgets.types';

const tempActiveBudget = 1;

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
						<ListItem key={idx} sx={{ height: '100%' }}>
							<Paper
								elevation={6}
								sx={(theme) => ({
									padding: '20px 50px',
									[theme.breakpoints.up('xs')]: {
										padding: '20px',
									},
									width: '100%',
									height: '100%',
								})}
							>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
									<Typography variant='h3'>
										{budget.name}
									</Typography>
									{(tempActiveBudget === budget.id)
										? <Chip color='success' label='Enabled' />
										: <Button variant='text'>Activate</Button>
									}
								</Box>
								<Typography variant='subtitle1'>
									{budget.shortDescription}
								</Typography>
								<Typography sx={(theme) => ({ color: theme.palette.text.disabled })} variant='body2'>
									Last updated: {new Date(budget.updatedOn).toLocaleString(LOCALE)}
								</Typography>
								<Button sx={{ display: 'flex', alignItems: 'center', mt: '8px' }}>
									<Typography component='span'>View and edit</Typography>{' '}
									<RightArrowIcon />
								</Button>
							</Paper>
						</ListItem>
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
