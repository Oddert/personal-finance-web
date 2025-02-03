import { FC, Fragment, useState } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import router, { ROUTES } from '../../../../constants/routerConstants';

import APIService from '../../../../services/APIService';

import { intakeError } from '../../../../redux/thunks/errorThunks';
import { deleteCard } from '../../../../redux/slices/cardSlice';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import type { IProps } from './DeleteCard.types';

/**
 * Modal component to allow the user to delete a card.
 * @component
 * @category Pages
 * @subcategory Card
 */
const DeleteBudget: FC<IProps> = ({ card }) => {
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);

    const handleClickDelete = () => {
        try {
            const request = async () => {
                await APIService.deleteSingleCard(card.id);
                dispatch(deleteCard({ cardId: card.id }));
                router.navigate(ROUTES.MANAGE_CARDS);
            };
            request();
        } catch (error) {
            dispatch(intakeError(error));
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
                    <DeleteIcon /> Delete card
                </Button>
            </Box>
            <Dialog open={open}>
                <DialogTitle>
                    Are you sure you want to delete card &ldquo;{card.cardName}
                    &rdquo;?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant='contained'>
                        Cancel
                    </Button>
                    <Button color='error' onClick={handleClickDelete}>
                        Delete card
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default DeleteBudget;
