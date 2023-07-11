import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom'

import router from '../../constants/routerConstants'

import Header from '../Header/';

import './App.css';

const App = () => {
    const [msg, setMsg] = useState(null)

    useEffect(() => {
    fetch('http://localhost:8080/')
        .then(res => res.json())
        .then(res => setMsg(res))
    }, [])

    return (
        <div className='App'>
            <Header />
            {/* Possibly move css baseline back? */}
            <RouterProvider router={router} />
            {msg}
        </div>
    );
}

export default App;
