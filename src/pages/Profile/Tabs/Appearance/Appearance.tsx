import { FC } from 'react';

import { Box, Typography } from '@mui/material';

import SidebarMode from '../../components/SidebarMode';

const Appearance: FC = () => {
    return (
        <Box>
            <Typography sx={{ mb: 4 }} variant='h3'>
                Appearance & Theme
            </Typography>
            <SidebarMode />
        </Box>
    );
};

export default Appearance;
