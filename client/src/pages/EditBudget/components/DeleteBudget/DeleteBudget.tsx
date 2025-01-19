import { FC, Fragment, useState } from 'react';
import { useNavigate } from 'react-router';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'

import { ROUTES } from '../../../../constants/routerConstants';

import routes from '../../../../services/routes';

import { deleteBudget } from '../../../../redux/slices/budgetSlice';

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers';

import type { IProps } from './DeleteBudget.types';

/**
 * Modal component to allow the user to delete an entire budget.
 * @component
 * @category Pages
 * @subcategory Home
 */
const DeleteBudget: FC<IProps> = ({ budget }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleClickDelete = () => {
        const request = async () => {
            await routes.deleteSingleBudget(budget.id);
            dispatch(deleteBudget({ budgetId: budget.id }));
            navigate(ROUTES.MANAGE_BUDGETS);
        }
        request();
    }

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
                    <DeleteIcon /> Delete budget
                </Button>
            </Box>
            <Dialog open={open}>
                <DialogTitle>
                    Are you sure you want to delete budget &ldquo;{budget.name}&rdquo;?
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
                        Delete budget
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DeleteBudget;
