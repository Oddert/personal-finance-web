import { FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Container, Paper } from '@mui/material';

import router, { ROUTES } from '../../constants/routerConstants';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import { getIsAuthenticated } from '../../redux/selectors/authSelectors';
import { userLogout } from '../../redux/thunks/authThunks';

import ExistingUser from './components/ExistingUser';
import Header from './components/Header';
import NewUser from './components/NewUser';
import SwitchMode from './components/SwitchMode';

/**
 * Landing page for un-authenticated users.
 * @component
 * @category Pages
 * @subcategory Login
 */
const Login: FC = () => {
    const dispatch = useAppDispatch();

    const [search] = useSearchParams();

    const [isExistingUser, setIsExistingUser] = useState(true);

    const isAuth = useAppSelector(getIsAuthenticated);
    console.log('[pages/Login] isAuth', isAuth);

    if (isAuth) {
        const logout = search.get('logout');

        if (logout === '1') {
            console.log('[pages/Login] logout requested');
            dispatch(userLogout());
            router.navigate(ROUTES.LOGIN);
        } else {
            const redirectAddr = search.get('redirect');
            console.log('[pages/Login] redirectAddr', redirectAddr);
            if (redirectAddr) {
                console.log('[pages/Login] redirecting to custom addr...');
                router.navigate(redirectAddr);
                return null;
            }
            console.log('[pages/Login] redirecting home...');
            router.navigate(ROUTES.HOME);
            return null;
        }
    }

    return (
        <Container>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 8,
                }}
            >
                <Paper
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 6,
                        py: 3,
                        mt: 8,
                    }}
                >
                    {isExistingUser ? <ExistingUser /> : <NewUser />}
                    <SwitchMode
                        isExisting={isExistingUser}
                        setIsExistingUser={setIsExistingUser}
                    />
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
