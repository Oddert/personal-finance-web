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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loadingState, setLoadingState] = useState<
        'idle' | 'loading' | 'success'
    >('idle');

    const loading = Boolean(loadingState === 'loading');
    const success = Boolean(loadingState === 'success');

    const incorrectDetails = useAppSelector(getIncorrectAuthDetails);

    /**
     * Change handler for the email field.
     */
    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
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
            dispatch(loginUser(email, password));
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
        () => Boolean(!password.length || !email.length || loading),
        [password, email, loading],
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Typography variant='h2'>{t('auth.Login')}</Typography>
            <TextField
                label={t('auth.Username')}
                onChange={handleChangeUsername}
                value={email}
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
                    {t('auth.incorrectEmailPassword')}
                </Typography>
            )}
        </Form>
    );
};

export default ExistingUser;
