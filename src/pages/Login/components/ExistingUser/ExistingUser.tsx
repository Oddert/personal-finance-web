import { ChangeEvent, FC, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { loginUser } from '../../../../redux/thunks/authThunks';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { TextField } from '../../Login.styles';

import SubmitButton from '../SubmitButton';

/**
 * The "Login" page allowing a user to sign in.
 *
 * Links to the "Sign Up" page.
 */
const ExistingUser: FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loadingState, setLoadingState] = useState<
        'idle' | 'loading' | 'success'
    >('idle');

    const loading = Boolean(loadingState === 'loading');
    const success = Boolean(loadingState === 'success');

    /**
     * Change handler for the username field.
     */
    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    /**
     * Change handler for the password field.
     */
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = () => {
        setLoadingState('loading');
        try {
            dispatch(loginUser(username, password));
        } catch (error) {
            setLoadingState('idle');
            console.error(error);
        }
    };

    /**
     * Disables the submit button on a number of conditions.
     */
    const submitDisabled = useMemo(
        () => Boolean(!password.length || !username.length || loading),
        [password, username, loading],
    );

    return (
        <Fragment>
            <Typography variant='h2'>{t('auth.Login')}</Typography>
            <TextField
                label={t('auth.Username')}
                onChange={handleChangeUsername}
                value={username}
                variant='outlined'
            />
            <TextField
                label={t('auth.Password')}
                onChange={handleChangePassword}
                type='password'
                value={password}
                variant='outlined'
            />
            <SubmitButton
                loading={loading}
                onSubmit={handleSubmit}
                submitDisabled={submitDisabled}
                success={success}
                text={t('auth.Login')}
            />
        </Fragment>
    );
};

export default ExistingUser;
