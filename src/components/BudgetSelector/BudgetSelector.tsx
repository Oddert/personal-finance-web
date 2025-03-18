import { FC } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import type { IBudget } from '../../types/Budget.types';

import {
    getActiveBudget,
    getBudgetResponse,
} from '../../redux/selectors/budgetSelectors';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import { setActiveBudget } from '../../redux/slices/budgetSlice';

import { IProps } from './BudgetSelector.types';

/**
 * Re-usable selector component for the Active Budget.
 *
 * Lower order component; only displays an Autoselect, no additional layout or labels.
 * @component
 * @category Components
 * @subcategory Budget Selector
 */
const BudgetSelector: FC<IProps> = () => {
    const dispatch = useAppDispatch();

    const budgets = useAppSelector(getBudgetResponse);
    const monthBudget = useAppSelector(getActiveBudget);
    console.log(budgets);

    const setMonthBudget = (nextBudget: IBudget) => {
        dispatch(setActiveBudget({ budget: nextBudget }));
    };

    return (
        <Autocomplete
            autoHighlight
            disablePortal
            isOptionEqualToValue={(option) => option.id === monthBudget?.id}
            getOptionLabel={(option) => option.name}
            onChange={(event, nextBudget) => {
                if (!nextBudget) {
                    return;
                }
                setMonthBudget(nextBudget);
            }}
            options={budgets}
            renderInput={(params) => (
                <TextField {...params} label='' placeholder='unset' />
            )}
            sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                    padding: '2px',
                },
            }}
            value={monthBudget}
        />
    );
};

export default BudgetSelector;
