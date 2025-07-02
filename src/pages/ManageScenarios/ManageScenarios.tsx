import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Typography } from '@mui/material';

import { TDynamicCardLayoutModes } from '../../types/Common.types';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import {
    getScenarios,
    getScenariosLoading,
} from '../../redux/selectors/scenarioSelectors';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import CreateScenarioButton from './components/CreateScenarioButton';
import CreateScenarioCard from './components/CreateScenarioCard';
import ScenarioCard from './components/ScenarioCard';

import { IProps } from './ManageScenarios.types';

const ManageScenarios: FC<IProps> = () => {
    const { t } = useTranslation();

    const [layout, setLayout] = useState<TDynamicCardLayoutModes>('standard');

    const scenarios = useAppSelector(getScenarios);
    const loading = useAppSelector(getScenariosLoading);

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
