import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IconButton, Toolbar, Typography } from '@mui/material';

import { AutoGraph as IconHome, Menu as IconMenu } from '@mui/icons-material';

import SidebarDiscreet from '../SidebarDiscreet';
import SidebarStatic from '../SidebarStatic';

import { AppBar } from './Header.styles';

const tempDiscreetSwitch = false;

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

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleToggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Fragment>
            <AppBar discreet={tempDiscreetSwitch} open={open} position='fixed'>
                <Toolbar>
                    <IconButton
                        aria-label='open drawer'
                        color='inherit'
                        edge='start'
                        onClick={handleToggleDrawer}
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && !tempDiscreetSwitch
                                ? { display: 'none' }
                                : false,
                        ]}
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
            {tempDiscreetSwitch ? (
                <SidebarDiscreet
                    onClose={handleDrawerClose}
                    onOpen={handleDrawerOpen}
                    open={open}
                />
            ) : (
                <SidebarStatic
                    onClose={handleDrawerClose}
                    onOpen={handleDrawerOpen}
                    onToggle={handleToggleDrawer}
                    open={open}
                />
            )}
        </Fragment>
    );
};

export default Header;
