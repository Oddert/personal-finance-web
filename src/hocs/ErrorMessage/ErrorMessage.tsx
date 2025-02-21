import { FC, Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Error as IconError } from '@mui/icons-material';

import { getErrorState } from '../../redux/selectors/errorSelectors';
import { clearError } from '../../redux/slices/errorSlice';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import { IProps } from './ErrorMessage.types';

/**
 * Error modal to display caught error messages.
 *
 * Acts a a 'first line of defence' error boundary, intended to catch all application errors.
 *
 * Unhandled errors still pass through to {@link ErrorBoundary} as a default but this should be avoided through proper error handling if possible.
 * @component
 * @category Hocs
 * @subcategory Error Message
 * @param props.children Application content to be displayed under the dialog.
 */
const ErrorMessage: FC<IProps> = ({ children }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const errorState = useAppSelector(getErrorState);

    const handleClickClear = useCallback(
        () => dispatch(clearError()),
        [dispatch],
    );

    return (
        <Fragment>
            {children}
            <Dialog
                open={errorState.dialogOpen}
                sx={(theme) => ({
                    '& .MuiPaper-root': {
                        backgroundColor: theme.palette.error.light,
                        minWidth: '50vw',
                        borderLeft: `15px solid ${theme.palette.error.dark}`,
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        padding: '16px 16px 0 16px',
                        '& *': {
                            color: theme.palette.common.black,
                        },
                    },
                })}
            >
                <Box sx={{ padding: '16px 24px' }}>
                    <IconError sx={{ width: '40px', height: '40px' }} />
                </Box>
                <DialogTitle variant='h2'>{errorState.title}</DialogTitle>
                <DialogContent sx={{ gridColumn: 2 }}>
                    <DialogContentText
                        sx={{ fontWeight: 'bold' }}
                        variant='subtitle2'
                    >
                        {t('literals.Message')}
                    </DialogContentText>
                    <DialogContentText>{errorState.message}</DialogContentText>
                    <DialogContentText
                        sx={{ fontWeight: 'bold', mt: '16px' }}
                        variant='subtitle2'
                    >
                        {t('literals.Error')}
                    </DialogContentText>
                    <DialogContentText>{errorState.error}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ gridColumn: 2 }}>
                    <Button
                        onClick={handleClickClear}
                        size='large'
                        sx={(theme) => ({
                            color: theme.palette.error.contrastText,
                        })}
                    >
                        {t('buttons.Close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ErrorMessage;
