import { FC } from 'react';

import { Box, Typography } from '@mui/material';

import SidebarMode from '../../components/SidebarMode';
import UserDetails from '../../components/UserDetails';

const Appearance: FC = () => {
    // const title = (
    //     <Typography sx={{ margin: '32px 0', textAlign: 'left' }} variant='h2'>
    //         {t('pageTitles.profile')}
    //     </Typography>
    // );
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gridGap: '16px',
                padding: '0 0 64px 0',
                mb: 2,
                width: '100%',
            }}
        >
            <Typography sx={{ mb: 4 }} variant='h2'>
                Appearance & Theme
            </Typography>
            <UserDetails />
            <SidebarMode />
        </Box>
    );
};

export default Appearance;
