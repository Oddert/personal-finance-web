/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress } from '@mui/material';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { ITransaction } from '../../../../types/Transaction.d';
import type { ColumnDef } from '@tanstack/react-table';

import TableWrapper from '../../../../components/Table/Table';
import { TransactionRange } from '../../../../contexts/transactionRangeContext';
import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import useTransactions from '../../../../hooks/useTransactions';
import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';
import { getTransactionsLoading } from '../../../../redux/selectors/transactionsSelectors';
import { transactionColumns } from '../../../../utils/transactionUtils';

dayjs.extend(customParseFormat);

/**
 * Displays all transactions within a selected date range as table.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const Table = () => {
    const { t } = useTranslation();

    const {
        state: { rangeValues, value },
    } = useContext(TransactionRange);

    const [filteredTransactions, setFilteredTransactions] = useState<
        ITransaction[]
    >([]);

    const { transactions } = useTransactions();

    const transactionsLoading = useAppSelector(getTransactionsLoading);
    const language = useAppSelector(getActiveLanguageCode);

    const columns = useMemo<ColumnDef<ITransaction>[]>(
        () => transactionColumns(language, t),
        [language, t],
    );

    useEffect(() => {
        const minDate = rangeValues[value[0]].bottom;
        const maxDate = rangeValues[value[1]].top;

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
        <TableWrapper<ITransaction>
            data={filteredTransactions}
            columns={columns}
        />
    );
};

export default Table;
