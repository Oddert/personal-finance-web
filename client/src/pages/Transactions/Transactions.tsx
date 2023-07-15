import { Box, Button, Container, Input, Typography } from '@mui/material'

import Table from './components/Table';

const Transactions = () => (
    <Container>
        <Typography variant='h2'>Transactions</Typography>
        <Box>
            <Input type='date' />
            <Input type='date' />
            <Button>Get transactions</Button>
        </Box>
        <Table />
    </Container>
)

export default Transactions
