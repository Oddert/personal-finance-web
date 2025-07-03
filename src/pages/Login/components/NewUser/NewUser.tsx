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
    emailValidator,
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
            email: '',
            password: '',
            confPassword: '',
            displayName: '',
        },
        validate: (nextValues) => {
            let errorsFound: boolean = false;
            const nextErrors: {
                email: string;
                password: string;
                confPassword: string;
                displayName: string;
            } = {
                email: '',
                password: '',
                confPassword: '',
                displayName: '',
            };

            const emailValid = emailValidator(nextValues.email);
            if (emailValid) {
                nextErrors.email = emailValid;
                errorsFound = true;
            }

            const passwordComparison = comparePasswords(
                nextValues.password,
                nextValues.confPassword,
            );
            if (passwordComparison) {
                nextErrors.confPassword = passwordComparison;
                errorsFound = true;
            }

            const pwdStrength = passwordStrength(nextValues.password);
            if (pwdStrength) {
                nextErrors.password = pwdStrength;
                errorsFound = true;
            }

            if (errorsFound) {
                return nextErrors;
            }
            return undefined;
        },
        onSubmit: (nextValues, formikBag) => {
            formikBag.setSubmitting(true);
            try {
                APIService.checkUserExists(nextValues.email)
                    .then((response) => {
                        if (response.payload?.exists) {
                            formikBag.setFieldError(
                                'email',
                                t('auth.usernameTaken'),
                            );
                        } else {
                            dispatch(
                                registerUser(
                                    nextValues.email,
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
        APIService.checkUserExists(values.email)
            .then((response) => {
                if (response.payload?.exists) {
                    setFieldError('email', t('auth.usernameTaken'));
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Typography variant='h2'>{t('auth.signUp')}</Typography>
            <TextField
                disabled={isSubmitting}
                error={Boolean(touched.email && errors.email)}
                label={t('auth.Username')}
                onBlur={() => {
                    checkUsernameAvailable();
                    setTouched({
                        ...touched,
                        email: true,
                        displayName: true,
                    });
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('email', event.target.value);
                }}
                value={values.email}
                variant='outlined'
            />
            {touched.email && errors.email ? (
                <Typography color='error'>{t(errors.email)}</Typography>
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
