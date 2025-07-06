import { ChangeEvent, FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import APIService from '../../../../services/APIService';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import { handleAuthResponse } from '../../../../redux/thunks/authThunks';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import {
    comparePasswords,
    passwordStrength,
} from '../../../../utils/signupUtils';

import SubmitButton from '../../../Login/components/SubmitButton';
import { Form, TextField } from '../../../Login/Login.styles';

import { IProps } from './ModalPassword.types';

/**
 * Presents the user with a form to change their password.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const ModalPassword: FC<IProps> = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const {
        errors,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setTouched,
        touched,
        validateField,
        values,
    } = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confPassword: '',
        },
        validate: (nextValues) => {
            let errorsFound: boolean = false;
            const nextErrors: {
                oldPassword: string;
                newPassword: string;
                confPassword: string;
            } = {
                oldPassword: '',
                newPassword: '',
                confPassword: '',
            };

            const staleComparison = comparePasswords(
                nextValues.oldPassword,
                nextValues.newPassword,
                true,
            );
            if (staleComparison) {
                nextErrors.confPassword = staleComparison;
                errorsFound = true;
            }
            const passwordComparison = comparePasswords(
                nextValues.newPassword,
                nextValues.confPassword,
            );
            if (passwordComparison) {
                nextErrors.confPassword = passwordComparison;
                errorsFound = true;
            }
            const pwdStrength = passwordStrength(nextValues.newPassword);
            if (pwdStrength) {
                nextErrors.newPassword = pwdStrength;
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
                APIService.changePassword(
                    nextValues.oldPassword,
                    nextValues.newPassword,
                )
                    .then((response) => {
                        dispatch(handleAuthResponse(response));
                        formikBag.setSubmitting(false);
                    })
                    .catch((err) => console.error(err));
            } catch (error) {
                dispatch(intakeError(error));
                formikBag.setSubmitting(false);
            }
        },
    });

    const onChange =
        (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
            setFieldValue(field, event.target.value);
        };

    const onBlur = (field: string) => () => {
        validateField(field);
        setTouched({ ...touched, [field]: true });
    };

    const handleClickReset = () => {
        setFieldValue('oldPassword', '');
        setFieldValue('newPassword', '');
        setFieldValue('confPassword', '');
        setOpen(false);
    };

    return (
        <Fragment>
            <Button
                onClick={() => setOpen(!open)}
                size='large'
                variant='contained'
            >
                {t('auth.changePassword')}
            </Button>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>{t('auth.changePasswordTitle')}</DialogTitle>
                <DialogContent>
                    <Form>
                        <TextField
                            disabled={isSubmitting}
                            error={Boolean(
                                touched.oldPassword && errors.oldPassword,
                            )}
                            label={t('auth.oldPassword')}
                            onBlur={onBlur('oldPassword')}
                            onChange={onChange('oldPassword')}
                            type='password'
                            value={values.oldPassword}
                            variant='outlined'
                        />
                        {touched.oldPassword && errors.oldPassword ? (
                            <Typography color='error'>
                                {t(errors.oldPassword)}
                            </Typography>
                        ) : null}
                        <TextField
                            disabled={isSubmitting}
                            error={Boolean(
                                touched.newPassword && errors.newPassword,
                            )}
                            label={t('auth.newPassword')}
                            onBlur={onBlur('newPassword')}
                            onChange={onChange('newPassword')}
                            type='password'
                            value={values.newPassword}
                            variant='outlined'
                        />
                        {touched.newPassword && errors.newPassword ? (
                            <Typography color='error'>
                                {t(errors.newPassword)}
                            </Typography>
                        ) : null}
                        <TextField
                            disabled={isSubmitting}
                            error={Boolean(
                                touched.confPassword && errors.confPassword,
                            )}
                            label={t('auth.confirmNewPassword')}
                            onBlur={onBlur('confPassword')}
                            onChange={onChange('confPassword')}
                            type='password'
                            value={values.confPassword}
                            variant='outlined'
                        />
                        {touched.confPassword && errors.confPassword ? (
                            <Typography color='error'>
                                {t(errors.confPassword)}
                            </Typography>
                        ) : null}
                    </Form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickReset}>
                        {t('buttons.Cancel')}
                    </Button>
                    <SubmitButton
                        loading={isSubmitting}
                        onSubmit={() => handleSubmit()}
                        submitDisabled={isSubmitting}
                        success={false}
                        text={t('auth.changePassword')}
                    />
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ModalPassword;
