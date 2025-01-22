import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import { IProps } from './FallbackError.types';

const FallbackError: FC<IProps> = () => {
    return (
        <Box sx={{ height: '100vh', width: '100%' }}>
            <Typography variant='h1'>
                Something has failed with the application.
            </Typography>
            <Typography variant='h2'>
                The application encountered an unhandled error which it could
                not recover from.
            </Typography>
            <Link to='/'>Return home</Link>
        </Box>
    );
};

export default FallbackError;
