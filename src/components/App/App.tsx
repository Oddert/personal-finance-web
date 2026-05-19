import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import router from '../../constants/routerConstants';
import { useAppDispatch } from '../../hooks/ReduxHookWrappers';
import useAuthToken from '../../hooks/useAuthToken';
import { refreshBudgets } from '../../redux/thunks/budgetThunks';
import { refreshCards } from '../../redux/thunks/cardThunks';
import { refreshCategories } from '../../redux/thunks/categoryThunks';
import { refreshScenarios } from '../../redux/thunks/scenarioThunks';

import './App.css';

/**
 * Core component of the application to be rendered inside relevant contexts and other boilerplate.
 * @category Components
 * @subcategory App
 * @component
 */
const App = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const { conditionallyRefreshAuth } = useAuthToken();

    useEffect(() => {
        const loadAppBaseInfo = () => {
            dispatch(refreshCategories(t));
            dispatch(refreshBudgets(t));
            dispatch(refreshCards(t));
            dispatch(refreshScenarios(t));
        };
        conditionallyRefreshAuth(loadAppBaseInfo);
    }, [conditionallyRefreshAuth, dispatch, t]);

    return (
        <Box className='App'>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
        </Box>
    );
};

export default App;
