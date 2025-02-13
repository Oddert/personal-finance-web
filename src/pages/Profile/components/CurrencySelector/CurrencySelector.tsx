import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    List,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import {
    KeyboardArrowUp as IconUp,
    KeyboardArrowDown as IconDown,
} from '@mui/icons-material';

import {
    reorderCurrencies,
    updateCurrencies,
} from '../../../../redux/slices/profileSlice';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { getUserCurrencies } from '../../../../redux/selectors/profileSelectors';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import { IProps } from './CurrencySelector.types';

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
            // @ts-ignore
            Intl.supportedValuesOf('currency').map((currencyCode) => [
                currencyCode,
                currencyLocaliser(3.14, currencyCode),
            ]),
        [currencyLocaliser],
    );

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridGap: '16px',
                '& .MuiAccordion-heading': {
                    background: 'red !important',
                },
            }}
        >
            <Autocomplete
                getOptionLabel={(option) =>
                    `${option[0]} (${t('literals.example')}: ${option[1]})`
                }
                getOptionKey={(option) => option[0]}
                multiple
                onChange={(event, nextValue) => {
                    if (nextValue) {
                        dispatch(
                            updateCurrencies({
                                currencies: nextValue.map((curr) => curr[1]),
                            }),
                        );
                    }
                }}
                options={currencies}
                renderInput={(props) => (
                    <TextField {...props} label={t('Favourite currencies')} />
                )}
                value={usersCurrencies.map((userCurrency) => [
                    userCurrency,
                    currencyLocaliser(3.14, userCurrency),
                ])}
            />
            <Accordion>
                <AccordionSummary>
                    {t('commonButtons.changeOrder')}
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {usersCurrencies.map((currency, idx) => (
                            <ListItem key={idx} divider>
                                <Box>
                                    <Button
                                        disabled={idx === 0}
                                        onClick={() =>
                                            dispatch(
                                                reorderCurrencies({
                                                    from: idx,
                                                    to: idx - 1,
                                                }),
                                            )
                                        }
                                        title={t('Move up in sort order')}
                                    >
                                        <IconUp />
                                    </Button>
                                    <Button
                                        disabled={idx === currencies.length - 1}
                                        onClick={() =>
                                            dispatch(
                                                reorderCurrencies({
                                                    from: idx,
                                                    to: idx + 1,
                                                }),
                                            )
                                        }
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
        </Box>
    );
};

export default LanguageSelector;
