import { FC } from 'react';

import { Box, Button, Chip, ListItem, Paper, Typography } from '@mui/material';
import {
	ArrowForward as RightArrowIcon,
} from '@mui/icons-material'

import { LOCALE } from '../../../../constants/appConstants';

import { IProps } from './BudgetCard.types';

const tempActiveBudget = 1;

const BudgetCard: FC<IProps> = ({ budget }) => {
	return (
		<ListItem sx={{ height: '100%' }}>
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
	);
}

export default BudgetCard;
