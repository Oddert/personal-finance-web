import { Box, Typography } from '@mui/material';

import { CellContext } from '@tanstack/react-table';

import { createReadableNumber } from '../../../../utils/commonUtils';

import { TransactionExtended } from './TPTable.types';

export const addCurrencySymbol = (
    cell: CellContext<TransactionExtended, unknown>,
) => {
    const rawValue = createReadableNumber(cell.renderValue(), 0);
    const value = Number(rawValue);
    return (
        <Box sx={{ textAlign: 'right' }}>
            {isNaN(value) || value === 0 ? '-' : `£${value.toFixed(2)}`}
        </Box>
    );
};

export const debitCell = (cell: CellContext<TransactionExtended, unknown>) => {
    const value = cell.renderValue<number>();
    const ctx = cell.row.getValue<boolean>('outOfBounds');
    return <Typography color={ctx ? 'error' : 'white'}>£{value}</Typography>;
};
