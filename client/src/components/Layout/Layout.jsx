import React from 'react'

import { Box } from '@mui/material'

import Header from '../Header/Header'

const Layout = ({ children }) => (
    <Box>
        <Header />
        {children}
    </Box>
)

export default Layout
