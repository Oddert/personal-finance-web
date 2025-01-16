import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Add as PlusIcon, Save as SaveIcon } from '@mui/icons-material';

import { IBudget, IBudgetRow } from '../../types/Budget.types';

import routes from '../../services/routes';
import { ROUTES } from '../../constants/routerConstants';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { addBudget, budgetLoading } from '../../redux/slices/budgetSlice';

import DynamicCardList from '../../components/DynamicCardList';

import BudgetRow from './components/BudgetRow';

import { IBudgetRowEditable, IProps } from './EditBudget.types';
import DeleteBudget from './components/DeleteBudget';

const createEmptyBudget = (id: number): IBudget => ({
	id,
	name: '',
	shortDescription: '',
	longDescription: '',
	isDefault: false,
	createdOn: new Date().toISOString(),
	updatedOn: new Date().toISOString(),
	budgetRows: [],
});

/**
 * Page to create or edit Budgets.
 * @category Pages
 * @subcategory Edit Budget
 * @component
 */
const EditBudget: FC<IProps> = () => {
	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [budget, setBudget] = useState<IBudget>(createEmptyBudget(-1));
	const [budgetRows, setBudgetRows] = useState<IBudgetRowEditable[]>([]);
	
	const params = useParams();
	const search = useSearchParams();

	const handleClickSave = () => {
		try {
			setLoading(true)
			dispatch(budgetLoading())
			const request = async () => {
				const response: any = isEdit
					? await routes.updateSingleBudget({ ...budget, budgetRows, }, budget.id)
					: await routes.createSingleBudget({ ...budget, budgetRows, })
				dispatch(addBudget({ budget: response.payload.budget }));
				navigate(ROUTES.MANAGE_BUDGETS);
			}
			request();
		} catch (error) {
			console.error(error);
			setLoading(false)
		}
	}

	useEffect(() => {
		const fetchBudget = async (budgetId: number) => {
			const response: any = await routes.getSingelBudget(budgetId)
			setBudget({
				...response.payload.budget as IBudget,
				budgetRows: [],
			});
			setBudgetRows(response.payload.budget.budgetRows.map(
				(budgetRow: IBudgetRow) => ({
					...budgetRow,
					staged: false,
					deleted: false,
				}),
			))
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
				<CircularProgress sx={{ mt: '64px' }} />
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
				<TextField
					label='Title'
					onChange={(event) => 
						setBudget({ ...budget, name:event.target.value })
					}
					value={budget.name}
				/>
				<TextField
					label='Tag line'
					onChange={(event) => 
						setBudget({ ...budget, shortDescription:event.target.value })
					}
					value={budget.shortDescription}
				/>
				<TextField
					label='Description'
					onChange={(event) => 
						setBudget({ ...budget, longDescription:event.target.value })
					}
					value={budget.longDescription}
				/>
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
								label: '',
								categoryId: -1,
								value: 20,
								varLowPc: 10,
								varHighPc: 10,
								staged: true,
								deleted: false,
								colour: '#fff',
							}
						])}
					>
						<PlusIcon /> Add budget row
					</Button>
				</DynamicCardList>
				<Button
					onClick={handleClickSave}
					sx={{
						position: 'fixed',
						right: '16px',
						bottom: '16px',
					}}
					variant='contained'
				>
					<SaveIcon />{' '}
					{isEdit ? 'Save changes' : 'Create budget'}
				</Button>
				<DeleteBudget budget={budget} />
			</Box>
		</ResponsiveContainer>
	)
}

export default EditBudget;
