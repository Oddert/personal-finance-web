import { FC, useMemo } from 'react';

import { Autocomplete, Box, TableCell, TextField } from '@mui/material';

import { getUserCurrencies } from '../../../../../../redux/selectors/profileSelectors';

import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';

import { IProps } from './CurrencySelector.types';

const marginTopBottom = '4px';

const CurrencySelector: FC<IProps> = ({ transaction }) => {
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
    console.log({
        allOptionsOrdered,
        currencies,
        t: !currencies.includes('GBP'),
    });

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
                        // borderWidth:
                        //     transaction.assignedCategory === 'unset' ? 4 : 1,
                        // width: '100%',
                        '& .MuiInputBase-root': {
                            padding: '2px',
                        },
                    }}
                    value={(transaction.currency as string) || currencies[0]}
                />
            </Box>
        </TableCell>
    );
};

export default CurrencySelector;
