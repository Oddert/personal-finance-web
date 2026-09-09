import {
    type FC,
    Fragment,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { EuroSymbol as IconCurrency } from '@mui/icons-material';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
} from '@mui/material';

import type { IProps } from './ChangeCurrency.types';

import {
    TransactionEditContext,
    changeCurrencyAll,
} from '../../../../../../contexts/transactionEditContext';
import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../../../../../hooks/useLocalisedNumber';
import { getUserCurrencies } from '../../../../../../redux/selectors/profileSelectors';

export const ChangeCurrency: FC<IProps> = ({ onClose }) => {
    const { t } = useTranslation();

    const { dispatch } = useContext(TransactionEditContext);

    const { currencyLocaliser } = useLocalisedNumber();

    const [currency, setCurrency] = useState<null | string[]>(null);
    const [open, setOpen] = useState(false);

    const usersCurrencies = useAppSelector(getUserCurrencies);

    const currencies: string[][] = useMemo(
        () =>
            Intl.supportedValuesOf('currency').map((currencyCode) => [
                currencyCode,
                currencyLocaliser(3.14, currencyCode),
            ]),
        [currencyLocaliser],
    );

    const handleClickSubmit = () => {
        onClose();
        if (currency) {
            dispatch(changeCurrencyAll(currency[0]));
        }
    };

    const handleClickClose = () => {
        setOpen(false);
        onClose();
    };

    useEffect(() => {
        if (usersCurrencies.length) {
            const foundCurrency = currencies.find(
                (opt) => opt[0] === usersCurrencies[0],
            );
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrency(foundCurrency ?? null);
        }
    }, [currencies, usersCurrencies]);

    return (
        <Fragment>
            <MenuItem
                onClick={() => {
                    setOpen(true);
                }}
            >
                <ListItemIcon>
                    <IconCurrency fontSize='small' />
                </ListItemIcon>
                <ListItemText>
                    {t('Transaction.changeCurrencyLabel')}
                </ListItemText>
            </MenuItem>
            <Dialog onClose={handleClickClose} open={open}>
                <DialogTitle>{t('Transaction.changeCurrencyAll')}</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        getOptionLabel={(option) =>
                            t('Profile.exampleLabel', {
                                label: option[0],
                                example: option[1],
                            })
                        }
                        getOptionKey={(option) => option[0]}
                        onChange={(_, nextValue) => {
                            setCurrency(nextValue ?? null);
                        }}
                        options={currencies}
                        renderInput={(props) => (
                            <TextField {...props} label={t('Add currency')} />
                        )}
                        value={currency}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose}>
                        {t('buttons.Cancel')}
                    </Button>
                    <Button
                        disabled={!currency}
                        onClick={handleClickSubmit}
                        variant='contained'
                    >
                        {t('Transaction.updateTransactions')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ChangeCurrency;
