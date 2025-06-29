import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import router from '../../constants/routerConstants';

import { refreshBudgets } from '../../redux/thunks/budgetThunks';
import { refreshCategories } from '../../redux/thunks/categoryThunks';
import { refreshCards } from '../../redux/thunks/cardThunks';
import { refreshScenarios } from '../../redux/thunks/scenarioThunks';

import useAuthToken from '../../hooks/useAuthToken';
import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import './App.css';

/**
 * Core component of the application to be rendered inside relevant contexts and other boilerplate.
 * @category Components
 * @subcategory App
 * @component
 */
const App = () => {
    const dispatch = useAppDispatch();

    const { conditionallyRefreshAuth } = useAuthToken();

    useEffect(() => {
        const loadAppBaseInfo = () => {
            dispatch(refreshCategories());
            dispatch(refreshBudgets());
            dispatch(refreshCards());
            dispatch(refreshScenarios());
        };
        conditionallyRefreshAuth(loadAppBaseInfo);
    }, []);

    return (
        <Box className='App'>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
        </Box>
    );
};

export default App;
