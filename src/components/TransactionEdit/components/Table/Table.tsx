import { Fragment, useContext, useMemo, useState } from 'react';
import {
    Checkbox,
    FormControlLabel,
    Table as MuiTable,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Typography,
    Button,
    Box,
} from '@mui/material';

import {
    checkAll,
    defaultColumns,
    TransactionEditContext,
    uncheckAll,
} from '../../../../contexts/transactionEditContext';

import Row from './components/Row';

/**
 * Displays the transactions and edit options as a table.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 */
const Table = () => {
    const [filterUncategorised, setFilterUncategorised] = useState(false);
    const [filterUnchecked, setFilterUnchecked] = useState(false);

    const {
        dispatch,
        state: { columnMap, transactions },
    } = useContext(TransactionEditContext);

    const columns: { accessorKey: string; header: string }[] = useMemo(() => {
        return defaultColumns.map((header) => {
            return {
                ...header,
                accessorKey: ['assignedCategory', 'selected'].includes(
                    header.accessorKey,
                )
                    ? header.accessorKey
                    : columnMap[header.accessorKey],
            };
        });
    }, [columnMap]);

    const data = useMemo(() => {
        const stageUncategorised = filterUncategorised
            ? transactions.filter(
                  (transaction) => !transaction.assignedCategory,
              )
            : transactions;
        const stageUnchecked = filterUnchecked
            ? stageUncategorised.filter((transaction) => transaction.selected)
            : stageUncategorised;
        return stageUnchecked;
    }, [filterUncategorised, filterUnchecked, transactions]);

    return (
        <Fragment>
            <Typography>
                {transactions.length === data.length
                    ? `${transactions.length} rows`
                    : `Showing ${data.length} of ${transactions.length} rows`}
            </Typography>
            <Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filterUncategorised}
                            onChange={(e) =>
                                setFilterUncategorised(e.currentTarget.checked)
                            }
                        />
                    }
                    label='Filter un-categorised'
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filterUnchecked}
                            onChange={(e) =>
                                setFilterUnchecked(e.currentTarget.checked)
                            }
                        />
                    }
                    label='Filter un-checked'
                />
            </Box>
            <Button onClick={() => dispatch(checkAll())}>Check all</Button>
            <Button onClick={() => dispatch(uncheckAll())}>Uncheck all</Button>
            <MuiTable
                sx={{
                    width: '100%',
                }}
            >
                <TableHead
                    sx={{
                        position: 'sticky',
                        top: 0,
                    }}
                >
                    <TableRow>
                        {columns.map((column, idx) => (
                            <TableCell key={idx}>{column.header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((transaction, idx) => (
                        <Row
                            columns={columns}
                            idx={idx}
                            transaction={transaction}
                        />
                    ))}
                </TableBody>
            </MuiTable>
        </Fragment>
    );
};

export default Table;
