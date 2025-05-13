import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { TDynamicCardLayoutModes } from '../../types/Common.types';

import { getBudgetResponse } from '../../redux/selectors/budgetSelectors';
import { refreshBudgets } from '../../redux/thunks/budgetThunks';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import BudgetCard from './components/BudgetCard';
import CreateBudgetButton from './components/CreateBudgetButton';
import CreateBudgetCard from './components/CreateBudgetCard';

import type { IProps } from './ManageBudgets.types';

/**
 * Page component to display all budgets.
 * @component
 * @category Pages
 * @subcategory Manage Budgets
 */
const ManageBudgets: FC<IProps> = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [layout, setLayout] = useState<TDynamicCardLayoutModes>('standard');

    const budgets = useAppSelector(getBudgetResponse);

    useEffect(() => {
        dispatch(refreshBudgets(true));
        // TODO: re-enable react-hooks/exhaustive-deps
    }, []);

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
                    {t('pageTitles.manageBudgets')}
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
};

export default ManageBudgets;
