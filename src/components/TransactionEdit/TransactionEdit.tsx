import {
    Box,
    CircularProgress,
    Container,
    Modal,
    Paper,
    Typography,
} from '@mui/material';

import { Fragment, useContext, type FC } from 'react';

import { TransactionEditContext } from '../../contexts/transactionEditContext';

import CardSelection from './components/CardSelection';
import CategoryQuickEdit from './components/CategoryQuickEdit';
import ColumnMapping from './components/ColumnMapping';
import Submit from './components/Submit';
import Table from './components/Table';

import type { IProps } from './TransactionEdit.types';

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
        state: { loading },
    } = useContext(TransactionEditContext);
    return (
        <Modal open={open} onClose={onClose} sx={{ overflowY: 'auto' }}>
            <Container>
                <Paper
                    sx={{
                        padding: '32px',
                        marginTop: '24px',
                        marginBottom: '24px',
                    }}
                >
                    <Typography variant='h2'>Bulk edit transactions</Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography>Uploading </Typography>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Fragment>
                            {showMapping ? <ColumnMapping /> : null}
                            <CardSelection />
                            <Submit onClose={onClose} />
                            <Table />
                            <Submit onClose={onClose} />
                        </Fragment>
                    )}
                </Paper>
                <CategoryQuickEdit />
            </Container>
        </Modal>
    );
};

export default TransactionEdit;
