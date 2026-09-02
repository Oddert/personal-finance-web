import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Typography } from '@mui/material';

import type { IProps } from './ManageScenarios.types';
import type { TDynamicCardLayoutModes } from '../../types/Common.types';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';
import ResponsiveContainer from '../../hocs/ResponsiveContainer';
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import {
    getScenarios,
    getScenariosLoading,
} from '../../redux/selectors/scenarioSelectors';
import { refreshScenarios } from '../../redux/thunks/scenarioThunks';

import CreateScenarioButton from './components/CreateScenarioButton';
import CreateScenarioCard from './components/CreateScenarioCard';
import ScenarioCard from './components/ScenarioCard';

/**
 * Displays all Scenarios with links to edit.
 * @component
 * @category Pages
 * @subcategory Manage Scenarios
 */
const ManageScenarios: FC<IProps> = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [layout, setLayout] = useState<TDynamicCardLayoutModes>('standard');

    const scenarios = useAppSelector(getScenarios);
    const loading = useAppSelector(getScenariosLoading);

    useEffect(() => {
        dispatch(refreshScenarios(t));
    }, [dispatch, t]);

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
                    {t('pageTitles.manageScenarios')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 8px',
                    }}
                >
                    <LayoutControls layout={layout} setLayout={setLayout} />
                    <CreateScenarioButton />
                </Box>
                {loading ? (
                    <Box sx={{ py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DynamicCardList layout={layout}>
                        {scenarios.map((scenario, idx) => (
                            <ScenarioCard key={idx} scenario={scenario} />
                        ))}
                        <CreateScenarioCard />
                    </DynamicCardList>
                )}
            </Box>
        </ResponsiveContainer>
    );
};

export default ManageScenarios;
