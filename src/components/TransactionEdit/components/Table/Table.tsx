import { Fragment, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconAdd } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';

import {
    TransactionEditContext,
    addRow,
    checkAll,
    defaultColumns,
    deleteAll,
    unDeleteAll,
    uncheckAll,
} from '../../../../contexts/transactionEditContext';
import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import { getUserCurrencies } from '../../../../redux/selectors/profileSelectors';

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const {
        dispatch,
        state: { columnMap, transactions },
    } = useContext(TransactionEditContext);

    const currencies = useAppSelector(getUserCurrencies);

    const handleClickCheckAll = () => {
        dispatch(checkAll());
    };
    const handleClickUnCheckAll = () => {
        dispatch(uncheckAll());
    };
    const handleClickDeleteAll = () => {
        dispatch(deleteAll());
    };
    const handleClickUnDeleteAll = () => {
        dispatch(unDeleteAll());
    };

    const columns: { accessorKey: string; header: string }[] = useMemo(() => {
        return defaultColumns.map((header) => {
            return {
                ...header,
                accessorKey: [
                    'assignedCategory',
                    'selected',
                    'deleted',
                    'currency',
                    'card',
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

    const currentPage = Math.min(
        page,
        Math.max(Math.ceil(data.length / rowsPerPage) - 1, 0),
    );

    const paginatedData = useMemo(
        () =>
            data.slice(
                currentPage * rowsPerPage,
                (currentPage + 1) * rowsPerPage,
            ),
        [currentPage, data, rowsPerPage],
    );

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
                            onChange={(e) => {
                                setPage(0);
                                setFilterUncategorised(e.currentTarget.checked);
                            }}
                        />
                    }
                    label={t('Transaction.filterUncategorised')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filterUnchecked}
                            onChange={(e) => {
                                setPage(0);
                                setFilterUnchecked(e.currentTarget.checked);
                            }}
                        />
                    }
                    label={t('Transaction.filterUnchecked')}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    onClick={() => {
                        dispatch(addRow(currencies[0] || ''));
                    }}
                    variant='outlined'
                >
                    <IconAdd /> {t('buttons.newRow')}
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Button onClick={handleClickCheckAll}>
                        {t('buttons.checkAll')}
                    </Button>
                    <Button onClick={handleClickUnCheckAll}>
                        {t('buttons.uncheckAll')}
                    </Button>
                </Box>
                <Box>
                    <Button onClick={handleClickDeleteAll}>
                        {t('buttons.deleteAll')}
                    </Button>
                    <Button onClick={handleClickUnDeleteAll}>
                        {t('buttons.unDeleteAll')}
                    </Button>
                </Box>
            </Box>
            <TablePagination
                component='div'
                count={data.length}
                onPageChange={(_, nextPage) => {
                    setPage(nextPage);
                }}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(0);
                }}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
            />
            <MuiTable
                sx={{
                    width: '100%',
                    '& .MuiTableCell-root': {
                        padding: 0,
                    },
                }}
            >
                <TableHead
                    sx={(theme) => ({
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        borderRadius: '4px',
                        background: theme.palette.background.paper,
                    })}
                >
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.accessorKey}>
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedData.map((transaction, idx) => (
                        <Row
                            columns={columns}
                            key={transaction.tecTempId}
                            idx={currentPage * rowsPerPage + idx}
                            transaction={transaction}
                        />
                    ))}
                </TableBody>
            </MuiTable>
            <TablePagination
                component='div'
                count={data.length}
                onPageChange={(_, nextPage) => {
                    setPage(nextPage);
                }}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(0);
                }}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
            />
        </Fragment>
    );
};

export default Table;
