import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { ColumnDef } from '@tanstack/react-table';

import type { Transaction } from '../../../../types/Transaction.d';

import { TransactionRange } from '../../../../contexts/transactionRangeContext';

import { RootState } from '../../../../redux/constants/store';
import { getTransactionsResponse } from '../../../../redux/selectors/transactionsSelectors';

import { transactionColumns } from '../../../../utils/transactionUtils';

import TableWrapper from '../../../../components/Table/Table';

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

    const transactions = useSelector<RootState, Transaction[]>((state) =>
        getTransactionsResponse(state),
    );

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => transactionColumns,
        [],
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

    return (
        <TableWrapper<Transaction>
            data={filteredTransactions}
            columns={columns}
        />
    );
};

export default Table;
