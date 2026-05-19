/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { type FC, useContext, useMemo } from 'react';

import { Autocomplete, Box, TableCell, TextField } from '@mui/material';

import type { IProps } from './CurrencySelector.types';

import { TransactionEditContext } from '../../../../../../contexts/transactionEditContext';
import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';
import { getUserCurrencies } from '../../../../../../redux/selectors/profileSelectors';

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
                        (transaction[columnMap.currency] as string) ??
                        (transaction.currency as string) ??
                        null
                    }
                />
            </Box>
        </TableCell>
    );
};

export default CurrencySelector;
