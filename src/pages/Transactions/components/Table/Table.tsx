import { useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { ColumnDef } from '@tanstack/react-table';

import type { Transaction } from '../../../../types/Transaction.d';

import { TransactionRange } from '../../../../contexts/transactionRangeContext';

import { getTransactionsLoading } from '../../../../redux/selectors/transactionsSelectors';

import useTransactions from '../../../../hooks/useTransactions';
import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import { transactionColumns } from '../../../../utils/transactionUtils';

import TableWrapper from '../../../../components/Table/Table';
import { Box, CircularProgress } from '@mui/material';
import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';

dayjs.extend(customParseFormat);

/**
 * Displays all transactions within a selected date range as table.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const Table = () => {
    const {
        state: { rangeValues, value },
    } = useContext(TransactionRange);

    const [filteredTransactions, setFilteredTransactions] = useState<
        Transaction[]
    >([]);

    const { transactions } = useTransactions();

    const transactionsLoading = useAppSelector(getTransactionsLoading);
    const language = useAppSelector(getActiveLanguageCode);

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => transactionColumns(language),
        [language],
    );

    useEffect(() => {
        const minDate = rangeValues[value[0]]?.bottom;
        const maxDate = rangeValues[value[1]]?.top;

        setFilteredTransactions(
            transactions.filter(
                (transaction) =>
                    transaction.date >= minDate && transaction.date <= maxDate,
            ),
        );
    }, [rangeValues, value, transactions]);

    if (transactionsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableWrapper<Transaction>
            data={filteredTransactions}
            columns={columns}
        />
    );
};

export default Table;
