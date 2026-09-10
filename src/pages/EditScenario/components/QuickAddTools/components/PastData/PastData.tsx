import { type FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ArrowForward as IconAddTransaction } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

import type { IProps } from './PastData.types';
import type { ITransaction } from '../../../../../../types/Transaction';
import type { ColumnDef } from '@tanstack/react-table';
import type { Dayjs } from 'dayjs';

import Table from '../../../../../../components/Table';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../../../redux/selectors/cardSelectors';
import { getCategoryOrderedDataById } from '../../../../../../redux/selectors/categorySelectors';
import { getActiveLanguageCode } from '../../../../../../redux/selectors/profileSelectors';
import { intakeError } from '../../../../../../redux/thunks/errorThunks';
import APIService from '../../../../../../services/APIService';
import { ffBlankTransactorRowEditable } from '../../../../../../utils/factoryFunctions';
import { addCurrencySymbol } from '../../../../../../utils/transactionUtils';
import MonthRangeRequest from '../MonthRangeRequest/MonthRangeRequest';

const PastData: FC<IProps> = ({ setTransactors }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(false);

    const language = useAppSelector(getActiveLanguageCode);
    const cards = useAppSelector(getCardResponse);
    const categories = useAppSelector(getCategoryOrderedDataById);

    const handleClickLoad = (startDate: Dayjs, endDate: Dayjs) => {
        const request = async () => {
            try {
                setLoading(true);
                const response = await APIService.getAllTransactionsWithinRange(
                    startDate.valueOf(),
                    endDate.valueOf(),
                    null,
                );
                if (response.payload?.transactions) {
                    setTransactions(response.payload.transactions);
                }
                setLoading(false);
            } catch (error) {
                dispatch(intakeError(error));
                setLoading(false);
            }
        };
        request();
    };

    const handleClickAdd = useCallback(
        (id: string) => {
            const foundTransaction = transactions.find((tr) => tr.id === id);
            if (foundTransaction) {
                setTransactors((transactors) => [
                    ...transactors,
                    ffBlankTransactorRowEditable({
                        categoryId: foundTransaction.categoryId,
                        // cardId: foundTransaction.cardId,
                        description: foundTransaction.description,
                        isAddition: foundTransaction.debit > 0,
                        value:
                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                            foundTransaction.debit ?? foundTransaction.credit,
                    }),
                ]);
            }
        },
        [setTransactors, transactions],
    );

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

                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
                    const cardId = String(cell.renderValue());
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
            {
                header: '',
                accessorKey: 'id',
                cell: (cell) => {
                    const id = String(cell.renderValue());
                    return (
                        <IconButton
                            onClick={() => {
                                handleClickAdd(id);
                            }}
                        >
                            <IconAddTransaction />
                        </IconButton>
                    );
                },
            },
        ],
        [cards, categories, handleClickAdd, language, t],
    );

    return (
        <Box>
            <MonthRangeRequest
                loading={loading}
                onClickLoad={handleClickLoad}
            />
            <Box sx={{ '> *': { fontSize: '8px' } }}>
                <Table<ITransaction>
                    columns={columns}
                    compact
                    data={transactions}
                    size='small'
                />
            </Box>
        </Box>
    );
};

export default PastData;
