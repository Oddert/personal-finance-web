import { FC, useContext } from 'react';

import { TableCell, TableRow } from '@mui/material';

import { TransactionEditContext } from '../../../../../../contexts/transactionEditContext';

import CategorySelector from '../CategorySelector';
import CurrencySelector from '../CurrencySelector';
import EditableNumber from '../EditableNumber';
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
        const key = idx + '_' + columnIdx;
        switch (column.accessorKey) {
            case columnMap.description:
                return (
                    <TransactionDescription
                        key={key}
                        transaction={transaction}
                    />
                );
            case columnMap.debit:
                return (
                    <EditableNumber
                        key={key}
                        colMapKey={'debit'}
                        transaction={transaction}
                    />
                );
            case columnMap.credit:
                return (
                    <EditableNumber
                        key={key}
                        colMapKey={'credit'}
                        transaction={transaction}
                    />
                );
            case columnMap.ballance:
                return (
                    <EditableNumber
                        key={key}
                        colMapKey={'ballance'}
                        transaction={transaction}
                    />
                );
            case 'selected':
                return <SelectOption key={key} transaction={transaction} />;
            case 'assignedCategory':
                return <CategorySelector key={key} transaction={transaction} />;
            case 'currency':
                return <CurrencySelector key={key} transaction={transaction} />;
            default:
                return (
                    <TableCell key={key}>
                        {transaction[column.accessorKey]}
                    </TableCell>
                );
        }
    };

    return <TableRow key={idx}>{columns.map(switchComponents)}</TableRow>;
};

export default Row;
