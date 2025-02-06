import { FC, useContext, useMemo } from 'react';

import { Autocomplete, Box, TableCell, TextField } from '@mui/material';

import { TransactionEditContext } from '../../../../../../contexts/transactionEditContext';

import { getUserCurrencies } from '../../../../../../redux/selectors/profileSelectors';

import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';

import { IProps } from './CurrencySelector.types';

const marginTopBottom = '4px';

/**
 * Renders the currency editor.
 * @component
 * @category Components
 * @subcategory Transaction Edit
 */
const CurrencySelector: FC<IProps> = ({ transaction }) => {
    const {
        state: { columnMap },
    } = useContext(TransactionEditContext);

    const currencies = useAppSelector(getUserCurrencies);

    const allOptionsOrdered = useMemo(
        () => [
            ...currencies,
            // @ts-ignore
            ...Intl.supportedValuesOf('currency').filter(
                (intlCurrency: string) => !currencies.includes(intlCurrency),
            ),
        ],
        [currencies],
    );

    return (
        <TableCell>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Autocomplete
                    autoHighlight
                    disablePortal
                    freeSolo
                    options={allOptionsOrdered}
                    groupBy={(item) =>
                        currencies.includes(item) ? 'Favourites' : 'Other'
                    }
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            sx={{
                                paddingTop: marginTopBottom,
                                paddingBottom: marginTopBottom,
                            }}
                        />
                    )}
                    sx={{
                        width: '90%',
                        '& .MuiInputBase-root': {
                            padding: '2px',
                        },
                    }}
                    value={
                        (transaction[columnMap.currency] as string) ||
                        (transaction?.currency as string) ||
                        currencies[0]
                    }
                />
            </Box>
        </TableCell>
    );
};

export default CurrencySelector;
