import { type FC, Fragment, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import type { IProps } from './TransactionEdit.types';

import {
    TransactionEditContext,
    toggleCloseModal,
} from '../../contexts/transactionEditContext';

import CardSelection from './components/CardSelection';
import CategoryQuickEdit from './components/CategoryQuickEdit';
import CloseModal from './components/CloseModal';
import ColumnMapping from './components/ColumnMapping';
import Submit from './components/Submit';
import Table from './components/Table';

/**
 * Allows the user to edit and submit / save transactions.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 * @param props.open If true, the modal is shown.
 * @param props.onClose Callback function invoked when the modal requests to close.
 * @param props.showMapping If true, the {@link ColumnMapping} options  will be displayed.
 */
const TransactionEdit: FC<IProps> = ({
    open,
    onClose,
    showMapping = false,
}) => {
    const {
        state: { loading, mode },
        dispatch,
    } = useContext(TransactionEditContext);

    const { t } = useTranslation();

    return (
        <Dialog
            fullWidth
            maxWidth='xl'
            open={open}
            onClose={() => {
                dispatch(toggleCloseModal(true));
            }}
            sx={{ overflowY: 'auto' }}
        >
            <DialogTitle variant='h2'>
                {mode === 'upload'
                    ? t('Transaction.bulkUploadTransactions')
                    : t('Transaction.bulkEditTransactions')}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography>{t('literals.Uploading')}</Typography>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Fragment>
                        {showMapping ? <ColumnMapping /> : null}
                        <CardSelection />
                        <Submit onClose={onClose} />
                        <Table />
                        <Submit onClose={onClose} />
                        <CloseModal onClose={onClose} />
                    </Fragment>
                )}
                <CategoryQuickEdit />
            </DialogContent>
        </Dialog>
    );
};

export default TransactionEdit;
