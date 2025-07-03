import { useTranslation } from 'react-i18next';

import { Box, Divider, Paper, Tooltip, Typography } from '@mui/material';
import {
    Info as IconInfo,
    SignLanguage as IconLanguage,
    Translate as IconTranslate,
} from '@mui/icons-material';

import { getUserCurrencies } from '../../../../redux/selectors/profileSelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import CurrencySelector from '../../components/CurrencySelector';
import LanguageSelector from '../../components/LanguageSelector';
import SystemLanguage from '../../components/SystemLanguage';

import { FC } from 'react';

/**
 * Presents the user with language, currency, and other localisation settings.
 * @component
 * @category Pages
 * @category Profile
 */
const Language: FC = () => {
    const { t } = useTranslation();
    const usersCurrencies = useAppSelector(getUserCurrencies);

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gridGap: '16px',
                padding: '0 0 64px 0',
            }}
        >
            <Typography
                sx={{ margin: '32px 0', textAlign: 'left' }}
                variant='h2'
            >
                <IconLanguage /> {t('pageTitles.profile.language')}
            </Typography>
            <Paper
                sx={{
                    px: 4,
                    py: 2,
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 1fr',
                    gridGap: 24,
                    alignItems: 'center',
                }}
            >
                <IconTranslate sx={{ gridRow: '1 / span 2' }} />
                <Box>
                    <Typography textAlign='left' sx={{ mb: 1 }} variant='h3'>
                        {t('Profile.displayLanguageTitle')}
                    </Typography>
                    <Typography textAlign='left'>
                        {t('Profile.displayLanguageDesc')}
                    </Typography>
                </Box>
                <SystemLanguage />
            </Paper>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                    padding: '0 0 64px 0',
                }}
            >
                <LanguageSelector />
                <Divider />
                <CurrencySelector />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gridGap: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography component='p' variant='h3'>
                    {t('Example number formatting:', {
                        number: currencyLocaliser(19482.25, usersCurrencies[0]),
                    })}
                </Typography>
                <Tooltip title={t('Profile.numberFormatExplanation')}>
                    <IconInfo />
                </Tooltip>
            </Box>
        </Box>
    );
};

export default Language;
