import { FC } from 'react';
import {
    Autocomplete,
    Box,
    FormLabel,
    TextField,
} from '@mui/material';

import type{ IBudget } from '../../types/Budget.types';

import { getActiveBudget, getBudgetResponse } from '../../redux/selectors/budgetSelectors';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import { setActiveBudget } from '../../redux/slices/budgetSlice';

import type { IProps } from './ActiveBudget.types';

/**
 * A control input to select the currently active budget.
 * @category Components
 * @subcategory Active Budget
 * @component
 */
const ActiveBudget: FC<IProps> = () => {
	const dispatch = useAppDispatch();

	const budgets = useAppSelector(getBudgetResponse);
	const monthBudget = useAppSelector(getActiveBudget);

	const setMonthBudget = (nextBudget: IBudget) => {
		dispatch(setActiveBudget({ budget: nextBudget }));
	}

    return (
        <Box
            sx={{
                display: 'inline-flex',
                gridGap: '16px',
                alignItems: 'center',
            }}
        >
            <FormLabel>Budget: </FormLabel>
            <Autocomplete
                autoHighlight
                disablePortal
                isOptionEqualToValue={(option) => option.id === monthBudget?.id}
                getOptionLabel={(option) => option.name}
                onChange={(event, nextBudget) => {
                    if (!nextBudget) {
                        return
                    }
                    setMonthBudget(nextBudget)
                }}
                options={budgets}
                renderInput={(params) => (
					<TextField
						{...params}
						label=''
						placeholder='unset'
                    />
                )}
                sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                        padding: '2px',
                    }
                }}
                value={monthBudget}
            />
        </Box>
    )
}

export default ActiveBudget
