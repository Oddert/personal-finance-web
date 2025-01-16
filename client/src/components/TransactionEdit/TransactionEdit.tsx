import { Box, CircularProgress, Container, Modal, Paper, Typography } from '@mui/material'

import { Fragment, useContext, type FC } from 'react'

import CategoryQuickEdit from './CategoryQuickEdit/'
import ColumnMapping from './ColumnMapping/'
import Submit from './Submit/'
import Table from './Table/'
import { TransactionEditContext } from '../../contexts/transactionEditContext'

interface Props {
    open: boolean,
    onClose: () => void
    showMapping?: boolean
}

const TransactionEdit: FC<Props> = ({ open, onClose, showMapping = false }) => {
    const { state: { loading } } = useContext(TransactionEditContext);
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ overflowY: 'auto' }}
        >
            <Container>
                <Paper sx={{ padding: '32px', marginTop: '24px', marginBottom: '24px' }}>
                    <Typography variant='h2'>
                        Bulk edit transactions
                    </Typography>
                    {loading
                        ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography>Uploading  </Typography>
                                <CircularProgress />
                            </Box>
                        )
                        : (
                            <Fragment>
                                {showMapping ? (
                                    <ColumnMapping />
                                ) : null}
                                <Submit onClose={onClose} />
                                <Table />
                                <Submit onClose={onClose} />
                            </Fragment>
                        )
                    }
                </Paper>
                <CategoryQuickEdit />
            </Container>
        </Modal>
    )
}

export default TransactionEdit
