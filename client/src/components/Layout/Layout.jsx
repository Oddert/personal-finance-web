import React from 'react'
import { Router, Routes, Route } from 'react-router'

const Home = () => (
    <div>Hello world</div>
)

const Layout = () => (
    <Router>
        <Routes>
            <Route Component={Home} index path='/' />
        </Routes>
    </Router>
)

export default Layout
