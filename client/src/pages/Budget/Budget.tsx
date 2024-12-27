import { FC } from 'react';

import { Typography } from '@mui/material';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

const Budget: FC = () => {
    return (
        <ResponsiveContainer>
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                Budget
            </Typography>
        </ResponsiveContainer>
    )
}

export default Budget;
