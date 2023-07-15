import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import { CssBaseline } from '@mui/material'

import { Box } from '@mui/material'

import router from '../../constants/routerConstants'

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import { requestTransactions } from '../../redux/slices/transactionsSlice'

import './App.css';
import { LOCALE } from '../../constants/appConstants';

const App = () => {
    const dispatch = useAppDispatch()

    // const [msg, setMsg] = useState(null)

    useEffect(() => {
        fetch('http://localhost:8080/')
            .then(res => res.json())
            // .then(res => setMsg(res))
            .then(res => console.log(res))
    }, [])

    useEffect(() => {
        const date = new Date()
        date.setMonth(0)
        date.setDate(1)
        const startDate = date.toLocaleDateString(LOCALE)
        dispatch(requestTransactions({ startDate }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box className='App'>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
            {/* {msg} */}
        </Box>
    );
}

export default App;
