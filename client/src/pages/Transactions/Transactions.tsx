import { Container, Typography } from '@mui/material'

import RequestControls from './components/RequestControls/';
import Table from './components/Table';

const Transactions = () => (
    <Container>
        <Typography sx={{ margin: '24px 0' }} variant='h2'>Transactions</Typography>
        <RequestControls />
        <Table />
    </Container>
)

export default Transactions
