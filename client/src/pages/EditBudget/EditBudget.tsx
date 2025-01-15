import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import DynamicCardList from '../../components/DynamicCardList';

import BudgetRow from './components/BudgetRow';

import { IBudgetRowEditable, IProps } from './EditBudget.types';

const EditBudget: FC<IProps> = () => {
	const [isEdit, setIsEdit] = useState(false);
	const [budgetDatums, setBudgetDatums] = useState<IBudgetRowEditable[]>([]);
	
	const params = useParams();
	const search = useSearchParams();

	useEffect(() => {
		console.log(params, search);
		if ('budgetId' in params) {
			setIsEdit(true);
		} else {
			if (search[0].get('templateId')) {
				// create from template
				console.log('create from template');
			}
		}
	}, [params, search])

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
				<TextField label='Title' />
				<TextField label='Description' />
				<DynamicCardList
					layout='list'
				>
					{budgetDatums.map((datum, idx) => (
						<BudgetRow
							budgetDatums={budgetDatums}
							budgetRow={datum}
							key={idx}
							setBudgetDatums={setBudgetDatums}
						/>
					))}
					<Button
						onClick={() => setBudgetDatums([
							...budgetDatums,
							{
								id: budgetDatums.length + 10,
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
