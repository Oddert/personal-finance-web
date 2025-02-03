import { useReducer } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

import {
    initialState,
    transactionRangeReducer,
    TransactionRange,
} from '../../contexts/transactionRangeContext';

import RangeControls from './components/RangeControls';
import RequestControls from './components/RequestControls';
import Table from './components/Table';
import Upload from '../../components/Upload';

import Edit from './components/Edit';

/**
 * Page component to display transactions within a range and upload new transactions.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const Transactions = () => {
    const [state, dispatch] = useReducer(transactionRangeReducer, initialState);

    return (
        <TransactionRange.Provider value={{ state, dispatch }}>
            <Container>
                <Typography sx={{ margin: '24px 0' }} variant='h2'>
                    Upload & Edit Transactions
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(1, 1fr)',
                        margin: '24px 0',
                        gridGap: '16px 32px',
                    }}
                >
                    <Upload />
                    <RequestControls />
                </Box>
                <Paper elevation={0} sx={{ padding: '16px 64px' }}>
                    <RangeControls />
                    <Edit />
                    <Table />
                </Paper>
            </Container>
        </TransactionRange.Provider>
    );
};

export default Transactions;
