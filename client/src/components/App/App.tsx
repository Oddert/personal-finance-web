import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { CssBaseline } from '@mui/material'

import { Box } from '@mui/material'

import router from '../../constants/routerConstants'

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import { requestTransactions } from '../../redux/slices/transactionsSlice'
import { refreshBudgets } from '../../redux/thunks/budgetThunks';

import './App.css';

dayjs.extend(localizedFormat)

const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const date = dayjs().set('month', 0).set('date', 1)
        const startDate = date.format('YYYY-MM-DD')
        const endDate = dayjs().format('YYYY-MM-DD')
        dispatch(requestTransactions({ startDate, endDate }))
		dispatch(refreshBudgets());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box className='App'>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
        </Box>
    );
}

export default App;
