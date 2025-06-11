import { useTranslation } from 'react-i18next';

import { Box, Divider, Paper, Tooltip, Typography } from '@mui/material';
import {
    Info as IconInfo,
    Language as IconLanguage,
    Paid as IconCurrency,
    Translate as IconTranslate,
} from '@mui/icons-material';

import { getUserCurrencies } from '../../../../redux/selectors/profileSelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import CurrencySelector from '../../components/CurrencySelector';
import LanguageSelector from '../../components/LanguageSelector';

import { FC } from 'react';
import SystemLanguage from '../../components/SystemLanguage/SystemLanguage';

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
                Language & Currency
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
                        Display Language
                    </Typography>
                    <Typography textAlign='left'>
                        Choose the main language to be used by the app.
                    </Typography>
                </Box>
                <SystemLanguage />
            </Paper>
            {/* <Box
                sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', mt: 4 }}
            > */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                    padding: '0 0 64px 0',
                }}
            >
                <Paper
                    sx={{
                        mb: 2,
                        px: 4,
                        py: 2,
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr 1fr',
                        gridGap: 24,
                        alignItems: 'center',
                    }}
                >
                    <IconLanguage sx={{ gridRow: '1 / span 2' }} />
                    <Box>
                        <Typography
                            textAlign='left'
                            sx={{ mb: 1 }}
                            variant='h3'
                        >
                            Preferred languages
                        </Typography>
                        <Typography textAlign='left'>
                            Select other languages which can be used if your
                            selected language is not available
                        </Typography>
                    </Box>
                    <Box>
                        <LanguageSelector />
                    </Box>
                </Paper>
                <Divider />
                <Paper
                    sx={{
                        mt: 2,
                        px: 4,
                        py: 2,
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr 1fr',
                        gridGap: 24,
                        alignItems: 'center',
                    }}
                >
                    <IconCurrency />
                    <Box>
                        <Typography
                            textAlign='left'
                            sx={{ mb: 1 }}
                            variant='h3'
                        >
                            Favourite Currencies
                        </Typography>
                        <Typography textAlign='left'>
                            Select currencies to be highlighted at the top of
                            the currency selector when adding transaction data.
                        </Typography>
                    </Box>
                    <CurrencySelector />
                </Paper>
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
                    {t('Example number formatting:')} &ldquo;
                    <Typography
                        component='span'
                        sx={{ fontWeight: 'bold' }}
                        variant='h3'
                    >
                        {currencyLocaliser(19482.25, usersCurrencies[0])}
                    </Typography>
                    &rdquo;
                </Typography>
                <Tooltip title='Numbers throughout the app are formatted based on language and currency formats.'>
                    <IconInfo />
                </Tooltip>
            </Box>
            {/* </Box> */}
        </Box>
    );
};

export default Language;
