import { Fragment, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const [filterUncategorised, setFilterUncategorised] = useState(false);
    const [filterUnchecked, setFilterUnchecked] = useState(false);

    const {
        dispatch,
        state: { columnMap, transactions },
    } = useContext(TransactionEditContext);

    const handleClickCheckAll = () => dispatch(checkAll());
    const handleClickUnCheckAll = () => dispatch(uncheckAll());

    const columns: { accessorKey: string; header: string }[] = useMemo(() => {
        return defaultColumns.map((header) => {
            return {
                ...header,
                accessorKey: [
                    'assignedCategory',
                    'selected',
                    'currency',
                ].includes(header.accessorKey)
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
                    ? t('Transaction.lengthRows', {
                          count: transactions.length,
                      })
                    : t('Transaction.showingCountOfRows', {
                          count: data.length,
                          transactions: transactions.length,
                      })}
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
                    label={t('Transaction.filterUncategorised')}
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
                    label={t('Transaction.filterUnchecked')}
                />
            </Box>
            <Button onClick={handleClickCheckAll}>
                {t('buttons.checkAll')}
            </Button>
            <Button onClick={handleClickUnCheckAll}>
                {t('buttons.uncheckAll')}
            </Button>
            <MuiTable
                sx={{
                    width: '100%',
                    '& .MuiTableCell-root': {
                        padding: 0,
                    },
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
