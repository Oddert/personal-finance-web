import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    KeyboardArrowDown as IconDown,
    KeyboardArrowUp as IconUp,
    Paid as IconCurrency,
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    List,
    ListItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';

import type { IProps } from './CurrencySelector.types';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';
import { getUserCurrencies } from '../../../../redux/selectors/profileSelectors';
import {
    reorderCurrencies,
    updateCurrencyPreferences,
} from '../../../../redux/thunks/profileThunks';

/**
 * Presents controls for the user to select their preferred languages and priority order.
 * @component
 * @category Pages
 * @subcategory Profile
 */
const LanguageSelector: FC<IProps> = () => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const usersCurrencies = useAppSelector(getUserCurrencies);

    const { currencyLocaliser } = useLocalisedNumber();

    const currencies: string[][] = useMemo(
        () =>
            Intl.supportedValuesOf('currency').map((currencyCode) => [
                currencyCode,
                currencyLocaliser(3.14, currencyCode),
            ]),
        [currencyLocaliser],
    );

    return (
        <Paper
            sx={{
                mt: 2,
                px: 4,
                py: 2,
                display: 'grid',
                gridTemplateColumns: 'auto 1fr 1fr',
                gridGap: '16px 24px',
                alignItems: 'center',
            }}
        >
            <IconCurrency />
            <Box>
                <Typography align='left' sx={{ mb: 1 }} variant='h3'>
                    {t('Profile.currencyTitle')}
                </Typography>
                <Typography align='left' variant='h3'>
                    {t('Profile.currencyDesc')}
                </Typography>
            </Box>
            <Autocomplete
                getOptionLabel={(option) =>
                    t('literals.example', {
                        label: option[0],
                        example: option[1],
                    })
                }
                getOptionKey={(option) => option[0]}
                onChange={(_, nextValue) => {
                    if (nextValue) {
                        dispatch(
                            updateCurrencyPreferences([
                                ...currencies.map((currency) => currency[1]),
                                nextValue[1],
                            ]),
                        );
                    }
                }}
                options={currencies}
                renderInput={(props) => (
                    <TextField {...props} label={t('Add currency')} />
                )}
                value={null}
            />
            <Accordion defaultExpanded sx={{ gridColumn: '1 / -1' }}>
                <AccordionSummary>{t('buttons.changeOrder')}</AccordionSummary>
                <AccordionDetails>
                    <List>
                        {usersCurrencies.map((currency, idx) => (
                            <ListItem key={idx} divider>
                                <Box>
                                    <Button
                                        disabled={idx === 0}
                                        onClick={() => {
                                            dispatch(
                                                reorderCurrencies(idx, idx - 1),
                                            );
                                        }}
                                        title={t('Move up in sort order')}
                                    >
                                        <IconUp />
                                    </Button>
                                    <Button
                                        disabled={idx === currencies.length - 1}
                                        onClick={() => {
                                            dispatch(
                                                reorderCurrencies(idx, idx + 1),
                                            );
                                        }}
                                        title={t('Move down in sort order')}
                                    >
                                        <IconDown />
                                    </Button>
                                </Box>
                                <Typography>
                                    {currency} (
                                    {currencyLocaliser(3.14, currency)})
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};

export default LanguageSelector;
