import { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import locale from 'locale-codes';

import { Autocomplete, Box, Typography } from '@mui/material';
import { Translate as IconTranslate } from '@mui/icons-material';

import APIService from '../../../../services/APIService';

import { registerUser } from '../../../../redux/thunks/authThunks';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import {
    comparePasswords,
    passwordStrength,
} from '../../../../utils/signupUtils';

import { Form, TextField } from '../../Login.styles';

import SubmitButton from '../SubmitButton';

/**
 * The "Sign Up" page allowing a user to make a new account.
 *
 * Links back to the "Login" page for users which already have an account.
 * @component
 * @category Pages
 * @subcategory Login
 */
const NewUser: FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [language, setLanguage] = useState(locale.getByTag('en-GB'));

    const {
        errors,
        handleSubmit,
        isSubmitting,
        setFieldError,
        setFieldValue,
        setTouched,
        touched,
        validateField,
        values,
    } = useFormik({
        initialValues: {
            username: '',
            password: '',
            confPassword: '',
            displayName: '',
        },
        validate: (nextValues) => {
            const nextErrors: {
                username: string;
                password: string;
                confPassword: string;
                displayName: string;
            } = {
                username: '',
                password: '',
                confPassword: '',
                displayName: '',
            };
            const passwordComparison = comparePasswords(
                nextValues.password,
                nextValues.confPassword,
            );
            if (passwordComparison) {
                nextErrors.confPassword = passwordComparison;
            }
            const pwdStrength = passwordStrength(nextValues.password);
            if (pwdStrength) {
                nextErrors.password = pwdStrength;
            }

            return nextErrors;
        },
        onSubmit: (nextValues, formikBag) => {
            formikBag.setSubmitting(true);
            try {
                APIService.checkUserExists(nextValues.username)
                    .then((response) => {
                        if (response.payload?.exists) {
                            formikBag.setFieldError(
                                'username',
                                t('auth.usernameTaken'),
                            );
                        } else {
                            dispatch(
                                registerUser(
                                    nextValues.username,
                                    nextValues.password,
                                    nextValues.displayName,
                                    'en-GB',
                                ),
                            );
                        }
                        formikBag.setSubmitting(false);
                    })
                    .catch((err) => console.error(err));
            } catch (error) {
                dispatch(intakeError(error));
                formikBag.setSubmitting(false);
            }
        },
    });

    const checkUsernameAvailable = () => {
        APIService.checkUserExists(values.username)
            .then((response) => {
                if (response.payload?.exists) {
                    setFieldError('username', t('auth.usernameTaken'));
                }
            })
            .catch((err) => console.error(err));
    };

    // TODO: language selector

    return (
        <Form onSubmit={handleSubmit}>
            <Typography variant='h2'>{t('auth.signUp')}</Typography>
            <TextField
                disabled={isSubmitting}
                error={Boolean(touched.username && errors.username)}
                label={t('auth.Username')}
                onBlur={() => {
                    checkUsernameAvailable();
                    setTouched({ ...touched, username: true });
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('username', event.target.value);
                }}
                value={values.username}
                variant='outlined'
            />
            {touched.username && errors.username ? (
                <Typography color='error'>{t(errors.username)}</Typography>
            ) : null}
            <TextField
                disabled={isSubmitting}
                error={Boolean(touched.password && errors.password)}
                label={t('auth.Password')}
                onBlur={() => {
                    validateField('password');
                    setTouched({ ...touched, password: true });
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('password', event.target.value);
                }}
                type='password'
                value={values.password}
                variant='outlined'
            />
            {touched.password && errors.password ? (
                <Typography color='error'>{t(errors.password)}</Typography>
            ) : null}
            <TextField
                disabled={isSubmitting}
                error={Boolean(touched.confPassword && errors.confPassword)}
                label={t('auth.confirmPassword')}
                onBlur={() => {
                    validateField('confPassword');
                    setTouched({ ...touched, confPassword: true });
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('confPassword', event.target.value);
                }}
                type='password'
                value={values.confPassword}
                variant='outlined'
            />
            {touched.confPassword && errors.confPassword ? (
                <Typography color='error'>{t(errors.confPassword)}</Typography>
            ) : null}
            <Box
                sx={{
                    display: 'flex',
                    gridGap: '16px',
                    alignItems: 'center',
                    mt: '16px',
                }}
            >
                <IconTranslate />
                <Autocomplete
                    getOptionLabel={(option) =>
                        `${option.name} (${option.tag})`
                    }
                    getOptionKey={(option) => option.tag}
                    onChange={(event, nextValue) => {
                        if (nextValue) {
                            setLanguage(nextValue);
                        }
                    }}
                    options={locale.all}
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            label={'placeholder - change profile page'}
                        />
                    )}
                    value={language}
                />
            </Box>
            <SubmitButton
                loading={isSubmitting}
                onSubmit={() => handleSubmit()}
                submitDisabled={isSubmitting}
                success={false}
                text={t('auth.signUp')}
            />
        </Form>
    );
};

export default NewUser;
