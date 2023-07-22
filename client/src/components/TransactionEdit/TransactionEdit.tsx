import { Container, Modal, Paper, Typography } from '@mui/material'

import type { FC } from 'react'

import ColumnMapping from './ColumnMapping/'
import Submit from './Submit/'
import Table from './Table/'

interface Props {
    open: boolean,
    onClose: () => void
}

const TransactionEdit: FC<Props> = ({ open, onClose }) => {
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
                    <ColumnMapping />
                    <Submit />
                    <Table />
                    <Submit />
                </Paper>
            </Container>
        </Modal>
    )
}

export default TransactionEdit
