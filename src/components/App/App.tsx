import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import router from '../../constants/routerConstants';

import { refreshBudgets } from '../../redux/thunks/budgetThunks';
import { refreshCategories } from '../../redux/thunks/categoryThunks';
import { refreshCards } from '../../redux/thunks/cardThunks';

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

    useEffect(() => {
        dispatch(refreshCategories());
        dispatch(refreshBudgets());
        dispatch(refreshCards());
    }, []);

    return (
        <Box className='App'>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
        </Box>
    );
};

export default App;
