import { useReducer } from 'react'
import { Box, Container, Typography } from '@mui/material'

import {
    initialState,
    transactionRangeReducer,
    TransactionRange,
} from '../../contexts/transactionRangeContext'

import RangeControls from './components/RangeControls';
import RequestControls from './components/RequestControls';
import Table from './components/Table';

const Transactions = () => {
    const [state, dispatch] = useReducer(transactionRangeReducer, initialState)
    
    return (
        <TransactionRange.Provider
            value={{ state, dispatch }}
        >
            <Container>
                <Typography sx={{ margin: '24px 0' }} variant='h2'>
                    Transactions
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', margin: '24px 0' }}>
                    <RequestControls />
                    <RangeControls />
                </Box>
                <Table />
            </Container>
        </TransactionRange.Provider>
    )
}

export default Transactions
