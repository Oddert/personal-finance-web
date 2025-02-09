import { FC, useContext } from 'react';

import { TableCell, TableRow } from '@mui/material';

import { TransactionEditContext } from '../../../../../../contexts/transactionEditContext';

import CategorySelector from '../CategorySelector';
import SelectOption from '../SelectOption';
import TransactionDescription from '../TransactionDescription';

import { IProps } from './Row.types';

/**
 * Displays a single table row.
 * @component
 * @category Components
 * @subcategory Transaction Edit
 * @param props.columns The column definition.
 * @param props.idx The row index.
 * @param props.transaction The row transaction.
 */
const Row: FC<IProps> = ({ columns, idx, transaction }) => {
    const {
        state: { columnMap },
    } = useContext(TransactionEditContext);

    const switchComponents = (
        column: {
            accessorKey: string;
            header: string;
        },
        columnIdx: number,
    ) => {
        switch (column.accessorKey) {
            case columnMap.description:
                return (
                    <TransactionDescription
                        key={idx + '_' + columnIdx}
                        transaction={transaction}
                    />
                );
            case 'selected':
                return (
                    <SelectOption
                        key={idx + '_' + columnIdx}
                        transaction={transaction}
                    />
                );
            case 'assignedCategory':
                return (
                    <CategorySelector
                        key={idx + '_' + columnIdx}
                        transaction={transaction}
                    />
                );
            default:
                return (
                    <TableCell key={idx + '_' + columnIdx}>
                        {transaction[column.accessorKey]}
                    </TableCell>
                );
        }
    };

    return (
        <TableRow
            key={idx}
            sx={{
                '& .transaction_description_edit': {
                    opacity: 0,
                    transition: '.1s linear',
                },
                '&:hover .transaction_description_edit': {
                    opacity: 1,
                },
            }}
        >
            {columns.map(switchComponents)}
        </TableRow>
    );
};

export default Row;
