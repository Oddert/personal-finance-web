import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { TDynamicCardLayoutModes } from '../../types/Common.types';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import { getScenarios } from '../../redux/selectors/scenarioSelectors';

import DynamicCardList from '../../components/DynamicCardList';
import LayoutControls from '../../components/LayoutControls';

import ScenarioCard from './components/ScenarioCard';

import { IProps } from './ManageScenarios.types';

const ManageScenarios: FC<IProps> = () => {
    const { t } = useTranslation();

    const [layout, setLayout] = useState<TDynamicCardLayoutModes>('standard');

    const scenarios = useAppSelector(getScenarios);
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
                    {/* <CreateBudgetButton /> */}
                </Box>
                <DynamicCardList layout={layout}>
                    {scenarios.map((scenario, idx) => (
                        <ScenarioCard key={idx} scenario={scenario} />
                    ))}
                    {/* <CreateBudgetCard /> */}
                </DynamicCardList>
            </Box>
        </ResponsiveContainer>
    );
};

export default ManageScenarios;
