import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import { CssBaseline } from '@mui/material'

import { Box } from '@mui/material'

import router from '../../constants/routerConstants'

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import { requestTransactions } from '../../redux/slices/transactionsSlice'

import './App.css';

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
        console.log(new Date())
        dispatch(requestTransactions())
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
