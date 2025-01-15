import { FC, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { IDynamicCardLayoutModes } from '../../types/Common.types';

import { getBudgetResponse } from '../../redux/selectors/budgetSelectors';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';
import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import BudgetCard from './components/BudgetCard';
import CreateBudgetButton from './components/CreateBudgetButton';
import CreateBudgetCard from './components/CreateBudgetCard';

import { IProps } from './ManageBudgets.types';

const ManageBudgets: FC<IProps> = () => {
	const [layout, setLayout] = useState<IDynamicCardLayoutModes>('standard');

	const budgets = useAppSelector(getBudgetResponse);

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
					<CreateBudgetButton />
				</Box>
				<DynamicCardList layout={layout}>
					{budgets.map((budget, idx) => (
						<BudgetCard budget={budget} key={idx} />
					))}
					<CreateBudgetCard />
				</DynamicCardList>
			</Box>
		</ResponsiveContainer>
	);
}

export default ManageBudgets;
