import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

import { IBudget } from '../../types/Budget.types';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import DynamicCardList from '../../components/DynamicCardList';

import BudgetRow from './components/BudgetRow';

import { IBudgetRowEditable, IProps } from './EditBudget.types';
import routes from '../../services/routes';

const createEmptyBudget = (id: number): IBudget => ({
	id,
	name: '',
	shortDescription: '',
	longDescription: '',
	isDefault: false,
	createdOn: new Date().toISOString(),
	updatedOn: new Date().toISOString(),
	budgetRows: [],
})

const EditBudget: FC<IProps> = () => {
	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [budget, setBudget] = useState<IBudget>(createEmptyBudget(-1));
	const [budgetRows, setBudgetRows] = useState<IBudgetRowEditable[]>([]);
	
	const params = useParams();
	const search = useSearchParams();

	useEffect(() => {
		const fetchBudget = async (budgetId: number) => {
			const response: any = await routes.getSingelBudget(budgetId)
			setBudget({
				...response.payload.budget as IBudget,
				budgetRows: [],
			});
			setBudgetRows(response.payload.budget.budgetRows)
			setLoading(false);
		}
		if ('budgetId' in params) {
			fetchBudget(Number(params['budgetId']))
			setIsEdit(true);
		} else {
			const templateId = search[0].get('templateId')
			if (templateId) {
				fetchBudget(Number(templateId))
				setIsEdit(false);
			} else {
				setLoading(false);
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (loading) {
		return (
			<ResponsiveContainer>
				<CircularProgress />
			</ResponsiveContainer>
		)
	}

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
                    {isEdit ? 'Edit ' : 'Create '}Budget
                </Typography>
				<TextField label='Title' value={budget.name} />
				<TextField label='Tag line' value={budget.shortDescription} />
				<TextField label='Description' value={budget.longDescription} />
				<DynamicCardList
					layout='list'
				>
					{budgetRows.map((datum, idx) => (
						<BudgetRow
							budgetRows={budgetRows}
							budgetRow={datum}
							key={idx}
							setBudgetRows={setBudgetRows}
						/>
					))}
					<Button
						onClick={() => setBudgetRows([
							...budgetRows,
							{
								id: budgetRows.length + 10,
								label: 'new thing',
								categoryId: -1,
								value: 20,
								varLowPc: 10,
								varHighPc: 10,
								staged: true,
								deleted: false,
							}
						])}
					>
						Add
					</Button>
				</DynamicCardList>
			</Box>
		</ResponsiveContainer>
	)
}

export default EditBudget;
