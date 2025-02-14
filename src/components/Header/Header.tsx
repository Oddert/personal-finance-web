import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { Menu as IconMenu, AutoGraph as IconHome } from '@mui/icons-material';

import Sidebar from '../Sidebar/Sidebar';

/**
 * Common header component, displays navigation elements and application title as h1.
 * @category Components
 * @subcategory Header
 * @component
 */
const Header = () => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleToggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: (theme) => (theme.zIndex.drawer || 0) + 2,
            }}
        >
            <AppBar
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: (theme) => (theme.zIndex.drawer || 0) + 2,
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
                        <IconMenu />
                    </IconButton>
                    <Link to='/'>
                        <IconButton
                            color='inherit'
                            aria-label='home page'
                            edge='start'
                            sx={(theme) => ({
                                marginRight: 5,
                                color: theme.palette.common.white,
                            })}
                        >
                            <IconHome />
                        </IconButton>
                    </Link>
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
                        {t('applicationTitle')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Sidebar handleDrawerClose={handleDrawerClose} open={open} />
        </Box>
    );
};

export default Header;
