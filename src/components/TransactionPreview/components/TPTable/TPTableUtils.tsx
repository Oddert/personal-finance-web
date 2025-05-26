import { Typography } from '@mui/material';

import { CellContext } from '@tanstack/react-table';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import { createReadableNumber } from '../../../../utils/commonUtils';

import { ITransactionExtended } from './TPTable.types';

export const addCurrencySymbol = (
    cell: CellContext<ITransactionExtended, unknown>,
) => {
    const { currencyLocaliser } = useLocalisedNumber();
    const rawValue = createReadableNumber(cell.renderValue(), 0);
    const value = Number(rawValue);
    return (
        <Typography sx={{ textAlign: 'right' }}>
            {isNaN(value) || value === 0 ? '-' : currencyLocaliser(value)}
        </Typography>
    );
};

export const debitCell = (cell: CellContext<ITransactionExtended, unknown>) => {
    const { currencyLocaliser } = useLocalisedNumber();
    const value = cell.renderValue<number>();
    const ctx = cell.row.getValue<boolean>('outOfBounds');
    return (
        <Typography color={ctx ? 'error' : 'white'}>
            {isNaN(value) || value === 0 ? '-' : currencyLocaliser(value)}
        </Typography>
    );
};
