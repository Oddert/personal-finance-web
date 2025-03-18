import { FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Container, Paper } from '@mui/material';

import router, { ROUTES } from '../../constants/routerConstants';

import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import { getIsAuthenticated } from '../../redux/selectors/authSelectors';

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
    const [search] = useSearchParams();
    const [isExistingUser, setIsExistingUser] = useState(true);

    const isAuth = useAppSelector(getIsAuthenticated);
    console.log('[pages/Login] isAuth: ', isAuth);

    if (isAuth) {
        const redirectAddr = search.get('redirect');
        console.log({ redirectAddr });
        if (redirectAddr) {
            router.navigate(redirectAddr);
            return null;
        }
        router.navigate(ROUTES.HOME);
        return null;
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
