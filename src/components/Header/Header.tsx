import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Box,
    IconButton,
    Toolbar,
    Typography,
    styled,
} from '@mui/material';

import { AutoGraph as IconHome, Menu as IconMenu } from '@mui/icons-material';

import SidebarDiscreet from '../SidebarDiscreet';
import SidebarStatic from '../SidebarStatic';

const openWidth = 240;
const tempDiscreetSwitch = false;

interface AppBarProps extends MuiAppBarProps {
    discreet?: boolean;
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open, discreet }) => open && !discreet,
            style: {
                marginLeft: openWidth,
                width: `calc(100% - ${openWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
    zIndex: theme.zIndex.drawer + 1,
}));

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
        <Box>
            <AppBar discreet={tempDiscreetSwitch} position='fixed' open={open}>
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
                <SidebarDiscreet onClose={handleDrawerClose} open={open} />
            ) : (
                <SidebarStatic
                    onClose={handleDrawerClose}
                    onToggle={handleToggleDrawer}
                    open={open}
                />
            )}
        </Box>
    );
};

export default Header;
