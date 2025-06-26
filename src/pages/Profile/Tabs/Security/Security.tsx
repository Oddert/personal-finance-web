import { FC } from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { Security as IconSecurity } from '@mui/icons-material';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import { getUserEmail } from '../../../../redux/selectors/authSelectors';

import ModalPassword from '../../components/ModalPassword';
import ModalEmail from '../../components/ModalEmail/ModalEmail';
import { useTranslation } from 'react-i18next';

const Security: FC = () => {
    const { t } = useTranslation();

    const email = useAppSelector(getUserEmail);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gridGap: '16px',
                padding: '0 0 64px 0',
                width: '100%',
                mb: 2,
            }}
        >
            <Typography sx={{ mb: 4 }} variant='h2'>
                <IconSecurity /> {t('Security')}
            </Typography>
            <Paper
                sx={{
                    px: 4,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography component='h4' textAlign='left' variant='body1'>
                    {t('auth.Email')}
                </Typography>
                <Box
                    sx={{ display: 'flex', gridGap: 24, alignItems: 'center' }}
                >
                    <Typography component='p' textAlign='left' variant='h4'>
                        {email}
                    </Typography>
                    <ModalEmail />
                </Box>
            </Paper>
            <Paper
                sx={{
                    px: 4,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography component='h4' textAlign='left' variant='body1'>
                    {t('auth.Password')}
                </Typography>
                <ModalPassword />
            </Paper>
        </Box>
    );
};

export default Security;
