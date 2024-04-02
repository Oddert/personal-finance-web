import React, { useState } from 'react'

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/AutoGraph'

import Sidebar from '../Sidebar/Sidebar'

const Header = () => {
    const [open, setOpen] = useState(false)

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleToggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: (theme) => (theme.zIndex.drawer || 0) + 2
            }}
        >
            <AppBar
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: (theme) => (theme.zIndex.drawer || 0) + 2
                }}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleToggleDrawer}
                        edge='start'
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton
                        color='inherit'
                        aria-label='home page'
                        onClick={handleToggleDrawer}
                        edge='start'
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography
                        sx={(theme) => ({
                            [theme.breakpoints.up('xs')]: {
                                fontSize: '16px',
                            },
                            [theme.breakpoints.up('sm')]: {
                                fontSize: '20px',
                            },
                            [theme.breakpoints.up('md')]: {
                                fontSize: '26px',
                            },
                            [theme.breakpoints.up('lg')]: {
                                fontSize: '32px',
                            },
                            [theme.breakpoints.up('xl')]: {
                                fontSize: '36px',
                            },
                        })}
                        variant='h1'
                    >
                        Personal Finance Tracker
                    </Typography>
                </Toolbar>
            </AppBar>            
            <Sidebar
                handleDrawerClose={handleDrawerClose}
                open={open}
            />
        </Box>
    )
}

export default Header
