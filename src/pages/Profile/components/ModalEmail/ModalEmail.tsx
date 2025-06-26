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

import { emailValidator } from '../../../../utils/signupUtils';

import SubmitButton from '../../../Login/components/SubmitButton';
import { Form, TextField } from '../../../Login/Login.styles';

import { IProps } from './ModalEmail.types';

const ModalEmail: FC<IProps> = () => {
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
            email: '',
        },
        validate: (nextValues) => {
            let errorsFound: boolean = false;
            const nextErrors: {
                email: string;
            } = {
                email: '',
            };

            const emailValid = emailValidator(nextValues.email);
            if (emailValid) {
                nextErrors.email = emailValid;
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
                APIService.changeEmail(nextValues.email)
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
        setFieldValue('email', '');
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
                {t('auth.changeEmail')}
            </Button>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>{t('auth.changeEmailTitle')}</DialogTitle>
                <DialogContent>
                    <Form>
                        <TextField
                            disabled={isSubmitting}
                            error={Boolean(touched.email && errors.email)}
                            label={t('auth.newEmailLabel')}
                            onBlur={onBlur('email')}
                            onChange={onChange('email')}
                            value={values.email}
                            variant='outlined'
                        />
                        {touched.email && errors.email ? (
                            <Typography color='error'>
                                {t(errors.email)}
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
                        text={t('auth.changeEmail')}
                    />
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ModalEmail;
