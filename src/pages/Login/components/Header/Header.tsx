import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AppBar, Toolbar, Typography } from '@mui/material';

/**
 * Simplified header component used by the Login page, with buttons and nav removed.
 * @component
 * @category Pages
 * @subcategory Login
 */
const Header: FC = () => {
    const { t } = useTranslation();
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
                    {t('applicationTitle')}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
