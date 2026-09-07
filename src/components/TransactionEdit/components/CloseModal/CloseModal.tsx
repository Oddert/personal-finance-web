import { type FC, useContext } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import type { IProps } from './CloseModal.type';

import {
    TransactionEditContext,
    toggleCloseModal,
} from '../../../../contexts/transactionEditContext';

const CloseModal: FC<IProps> = ({ onClose }) => {
    const {
        state: { closeModalOpen },
        dispatch,
    } = useContext(TransactionEditContext);
    return (
        <Dialog
            onClose={() => {
                dispatch(toggleCloseModal(false));
            }}
            open={closeModalOpen}
        >
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogContent>Any changes made will not be saved.</DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        dispatch(toggleCloseModal(false));
                    }}
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button
                    color='error'
                    onClick={() => {
                        dispatch(toggleCloseModal(false));
                        onClose();
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CloseModal;
