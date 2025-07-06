import { FC, Fragment, useState } from 'react';
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
import { Delete as IconDelete } from '@mui/icons-material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import APIService from '../../../../services/APIService';

import { deleteBudget } from '../../../../redux/slices/budgetSlice';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import type { IProps } from './DeleteBudget.types';
import { refreshAuthentication } from '../../../../redux/thunks/authThunks';

/**
 * Modal component to allow the user to delete an entire budget.
 * @component
 * @category Pages
 * @subcategory Home
 */
const DeleteBudget: FC<IProps> = ({ budget }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);

    const handleClickDelete = () => {
        const request = async () => {
            await APIService.deleteSingleBudget(budget.id);
            dispatch(deleteBudget({ budgetId: budget.id }));
            router.navigate(ROUTES.MANAGE_BUDGETS);
        };

        try {
            request();
        } catch (error1: any) {
            if (error1.status === 401) {
                try {
                    dispatch(refreshAuthentication(request));
                } catch (error2: any) {
                    dispatch(intakeError(error1));
                }
            } else {
                dispatch(intakeError(error1));
            }
        }
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    color='error'
                    onClick={() => setOpen(true)}
                    sx={{
                        mt: '64px',
                        maxWidth: '300px',
                    }}
                    variant='outlined'
                >
                    <IconDelete /> {t('buttons.deleteBudget')}
                </Button>
            </Box>
            <Dialog open={open}>
                <DialogTitle>
                    {t('Budget.sureYouWantToDeleteBudget', {
                        budgetName: budget.name,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('modalMessages.cannotBeUndone')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant='contained'>
                        {t('buttons.Cancel')}
                    </Button>
                    <Button color='error' onClick={handleClickDelete}>
                        {t('buttons.deleteBudget')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default DeleteBudget;
