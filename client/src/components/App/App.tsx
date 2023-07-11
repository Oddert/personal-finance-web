import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom'

import { Box } from '@mui/material'

import router from '../../constants/routerConstants'

import './App.css';

const App = () => {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
    fetch('http://localhost:8080/')
        .then(res => res.json())
        .then(res => setMsg(res))
    }, [])

    return (
        <Box className='App'>
            {/* Possibly move css baseline back? */}
            <RouterProvider router={router} />
            {msg}
        </Box>
    );
}

export default App;
