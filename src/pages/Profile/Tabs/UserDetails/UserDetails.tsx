import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

const UserDetails: FC = () => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                // display: 'flex',
                // flexDirection: 'column',
                // gridGap: '16px',
                // padding: '0 0 64px 0',
                mb: 2,
            }}
        >
            <Typography variant='h2' sx={{ margin: '32px 0' }}>
                {t('pageTitles.profile')}
            </Typography>
        </Box>
    );
};

export default UserDetails;
