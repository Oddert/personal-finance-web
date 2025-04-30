import { FC } from 'react';

import { Box } from '@mui/material';

import { getIsAuthenticated } from '../../redux/selectors/authSelectors';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import Header from '../Header/Header';

import { IProps } from './Layout.types';

/**
 * Adds the nav bar and any other common attributes to a page.
 * @category Components
 * @subcategory Layout
 * @component
 * @param props.children The page contents.
 */
const Layout: FC<IProps> = ({
    children,
    requiresAuth = false,
    returnAddr = '',
}) => {
    const isAuth = useAppSelector(getIsAuthenticated);

    if (requiresAuth && !isAuth) {
        console.log(
            '[components/Layout] requiresAuth, !isAuth, returnAddr',
            requiresAuth,
            !isAuth,
            returnAddr,
        );
        return null;
    }
    console.log('[src/components/Layout] auth check passed');

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component='main' sx={{ flexGrow: 1, p: 3, pt: 12 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
