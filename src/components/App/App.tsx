import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, CssBaseline } from '@mui/material';

import router from '../../constants/routerConstants';

import { requestTransactions } from '../../redux/slices/transactionsSlice';
import { refreshBudgets } from '../../redux/thunks/budgetThunks';
import { refreshCards } from '../../redux/thunks/cardThunks';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import './App.css';

dayjs.extend(localizedFormat);

/**
 * Core component of the application to be rendered inside relevant contexts and other boilerplate.
 * @category Components
 * @subcategory App
 * @component
 */
const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const date = dayjs().subtract(3, 'months').startOf('month');
        const startDate = date.format('YYYY-MM-DD');
        const endDate = dayjs().format('YYYY-MM-DD');
        dispatch(requestTransactions({ startDate, endDate }));
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
