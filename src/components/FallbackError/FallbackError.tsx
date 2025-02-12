import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { IProps } from './FallbackError.types';

const FallbackError: FC<IProps> = () => {
    const { t } = useTranslation();
    return (
        <Box sx={{ height: '100vh', width: '100%' }}>
            <Typography variant='h1'>{t('fallbackError.title')}</Typography>
            <Typography variant='h2'>
                {t('fallbackError.description')}
            </Typography>
            <Link to='/'>{t('commonButtons.returnHome')}</Link>
        </Box>
    );
};

export default FallbackError;
