import { type FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Delete as IconDelete } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import type { IProps } from './DeleteCard.types';

import router, { ROUTES } from '../../../../constants/routerConstants';
import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';
import { deleteCard } from '../../../../redux/slices/cardSlice';
import { refreshAuthentication } from '../../../../redux/thunks/authThunks';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import APIService from '../../../../services/APIService';

/**
 * Modal component to allow the user to delete a card.
 * @component
 * @category Pages
 * @subcategory Card
 */
const DeleteBudget: FC<IProps> = ({ card }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);

    const handleClickDelete = () => {
        const request = async () => {
            await APIService.deleteSingleCard(card.id);
            dispatch(deleteCard({ cardId: card.id }));
            router.navigate(ROUTES.MANAGE_CARDS);
        };

        try {
            request();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error1: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error1.status === 401) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    dispatch(refreshAuthentication(request));
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
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
                    onClick={() => {
                        setOpen(true);
                    }}
                    sx={{
                        mt: '64px',
                        maxWidth: '300px',
                    }}
                    variant='outlined'
                >
                    <IconDelete /> {t('buttons.deleteCard')}
                </Button>
            </Box>
            <Dialog open={open}>
                <DialogTitle>
                    {t('modalMessages.sureYouWantToDeleteCard', {
                        cardName: card.cardName,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('modalMessages.cannotBeUndone')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                        variant='contained'
                    >
                        {t('buttons.Cancel')}
                    </Button>
                    <Button color='error' onClick={handleClickDelete}>
                        {t('buttons.deleteCard')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default DeleteBudget;
