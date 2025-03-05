import { FC } from 'react';

import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: FC = () => {
    return (
        <AppBar position='fixed'>
            <Toolbar>
                <Typography
                    sx={(theme) => ({
                        ml: '10vw',
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
                    Tickler Files
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
