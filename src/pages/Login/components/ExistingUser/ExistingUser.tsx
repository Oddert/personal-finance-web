import { ChangeEvent, FC, SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { loginUser } from '../../../../redux/thunks/authThunks';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { Form, TextField } from '../../Login.styles';

import SubmitButton from '../SubmitButton';
import { getIncorrectAuthDetails } from '../../../../redux/selectors/authSelectors';
import { clearIncorrectDetails } from '../../../../redux/slices/authSlice';
import { intakeError } from '../../../../redux/thunks/errorThunks';

/**
 * The "Login" page allowing a user to sign in.
 *
 * Links to the "Sign Up" page for users without an account.
 * @component
 * @category Pages
 * @subcategory Login
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

    const incorrectDetails = useAppSelector(getIncorrectAuthDetails);

    /**
     * Change handler for the username field.
     */
    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        if (incorrectDetails) {
            dispatch(clearIncorrectDetails());
        }
    };

    /**
     * Change handler for the password field.
     */
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        if (incorrectDetails) {
            dispatch(clearIncorrectDetails());
        }
    };

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        setLoadingState('loading');
        try {
            dispatch(loginUser(username, password));
            setLoadingState('idle');
        } catch (error) {
            setLoadingState('idle');
            dispatch(intakeError(error));
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
        <Form onSubmit={handleSubmit}>
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
            {incorrectDetails && (
                <Typography color='error'>
                    Incorrect username or password, please check and try again.
                </Typography>
            )}
        </Form>
    );
};

export default ExistingUser;
