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
import { getCardResponse } from '../../../../redux/selectors/cardSelectors';
import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';
import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';
import { getTransactionsLoading } from '../../../../redux/selectors/transactionsSelectors';
import { addCurrencySymbol } from '../../../../utils/transactionUtils';

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
    console.log({ transactions });

    const transactionsLoading = useAppSelector(getTransactionsLoading);
    const language = useAppSelector(getActiveLanguageCode);
    const cards = useAppSelector(getCardResponse);
    const categories = useAppSelector(getCategoryOrderedDataById);

    const columns = useMemo<ColumnDef<ITransaction>[]>(
        () => [
            {
                header: t('literals.Date'),
                accessorKey: 'date',
                cell: (cell) => {
                    const value = cell.renderValue();
                    try {
                        // @ts-expect-error use of try-catch accounts for errors thrown from bad 'unknown' values
                        return new Date(value).toLocaleDateString(language);
                    } catch {
                        return value;
                    }
                },
            },
            {
                header: t('literals.Description'),
                accessorKey: 'description',
            },
            {
                header: t('literals.Out'),
                accessorKey: 'debit',
                cell: addCurrencySymbol,
            },
            {
                header: t('literals.In'),
                accessorKey: 'credit',
                cell: addCurrencySymbol,
            },
            {
                header: t('literals.Ballance'),
                accessorKey: 'ballance',
                cell: addCurrencySymbol,
            },
            {
                header: t('literals.Category'),
                accessorKey: 'categoryId',
                cell: (cell) => {
                    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
                    const categoryId: string | unknown = cell.renderValue();
                    if (typeof categoryId === 'string') {
                        const foundCategory = categories[categoryId];
                        if (foundCategory) {
                            return foundCategory.label;
                        }
                    }
                    return `- ${t('literals.uncategorised')} -`;
                },
            },
            {
                header: t('literals.Card'),
                accessorKey: 'cardId',
                cell: (cell) => {
                    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
                    const cardId: string | unknown = cell.renderValue();
                    if (typeof cardId === 'string') {
                        const foundCard = cards.find(
                            (card) => card.id === cardId,
                        );
                        if (foundCard) {
                            return foundCard.cardName;
                        }
                    }
                    return `- ${t('literals.uncategorised')} -`;
                },
            },
        ],
        [language, t],
    );

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const minDate = rangeValues[value[0]]?.bottom;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const maxDate = rangeValues[value[1]]?.top;

        setFilteredTransactions(
            transactions.filter((transaction) => {
                const date = dayjs(transaction.date).valueOf();
                return date >= minDate && date <= maxDate;
            }),
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
