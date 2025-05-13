import { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Button, CircularProgress } from '@mui/material';

import { Category } from '../../../../types/Category.d';
import { Transaction } from '../../../../types/Transaction.d';

import { TransactionEditContext } from '../../../../contexts/transactionEditContext';

import APIService from '../../../../services/APIService';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';

import { requestTransactions } from '../../../../redux/slices/transactionsSlice';
import { intakeError } from '../../../../redux/thunks/errorThunks';
import { getActiveCardId } from '../../../../redux/selectors/cardSelectors';
import { getUserCurrencies } from '../../../../redux/selectors/profileSelectors';

import type { IProps } from './Submit.types';

dayjs.extend(localizedFormat);

/**
 * Button to submit / save the transactions.
 *
 * Formats and submits the transactions in the current context.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 * @param props.onClose Callback function invoked when the submit succeeds.
 */
const Submit: FC<IProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const appDispatch = useAppDispatch();
    const {
        state: { columnMap, mode, transactions },
    } = useContext(TransactionEditContext);

    const activeCardId = useAppSelector(getActiveCardId);
    const userCurrencies = useAppSelector(getUserCurrencies);

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        // Filter only for items which are checked.
        const filteredTransactions = transactions.filter(
            (transaction) => transaction.selected,
        );

        // Convert the keys from the user's proprietary CSV format to our transaction format.
        const stagedTemp = filteredTransactions.map((transaction) => {
            const formattedTransaction: Partial<Transaction> = {
                assignedCategory:
                    (transaction[
                        columnMap.assignedCategory
                    ] as Category | null) ||
                    (transaction.assignedCategory as Category | null) ||
                    undefined,
                ballance:
                    (transaction[columnMap.ballance] as number) ||
                    (transaction.ballance as number) ||
                    0,
                cardId:
                    (transaction[columnMap.cardId] as string | null) ||
                    (transaction.cardId as string | null) ||
                    activeCardId,
                categoryId:
                    (transaction[columnMap.categoryId] as string | null) ||
                    (transaction.categoryId as string | null) ||
                    null,
                currency:
                    (transaction[columnMap.currency] as string | null) ||
                    (transaction.currency as string | null) ||
                    userCurrencies.length
                        ? userCurrencies[0]
                        : null,
                date:
                    (transaction[columnMap.date] as number) ||
                    (transaction.date as number) ||
                    0,
                description:
                    (transaction[columnMap.description] as string) ||
                    (transaction.description as string) ||
                    '',
                transactionType:
                    (transaction[columnMap.transactionType] as string) ||
                    (transaction.transactionType as string) ||
                    'DEB',
            };

            // Handle number values separately as they are expected to be string (though not limited to).
            // Numbers may also be represented by dashes which must be converted.
            const numKeys: ('credit' | 'debit' | 'ballance')[] = [
                'credit',
                'debit',
                'ballance',
            ];
            numKeys.forEach((column: 'credit' | 'debit' | 'ballance') => {
                const tecValue: string | number | boolean | null =
                    transaction[columnMap[column]] || transaction[column] || 0;
                if (
                    typeof tecValue === 'boolean' ||
                    (typeof tecValue === 'string' && tecValue === '-')
                ) {
                    formattedTransaction[column] = 0;
                } else {
                    formattedTransaction[column] = Number(tecValue);
                }
            });
            return formattedTransaction;
        });

        try {
            const request = async () => {
                const response =
                    mode === 'upload'
                        ? await APIService.createManyTransactions(stagedTemp)
                        : await APIService.updateManyTransactions(stagedTemp);
                setLoading(false);
                if (response.status === 201) {
                    onClose();
                    const date = dayjs().startOf('month').startOf('date');
                    const startDate = date.format('YYYY-MM-DD');
                    const endDate = dayjs().format('YYYY-MM-DD');
                    appDispatch(requestTransactions({ startDate, endDate }));
                }
            };
            setLoading(true);
            request();
        } catch (error) {
            appDispatch(intakeError(error));
        }
    };

    return (
        <Button
            color='primary'
            disabled={loading}
            onClick={handleClick}
            sx={{
                margin: '12px 0 12px auto',
                display: 'block',
            }}
            variant='contained'
        >
            {loading ? (
                <CircularProgress />
            ) : mode === 'upload' ? (
                t('buttons.Submit')
            ) : (
                t('buttons.Save')
            )}
        </Button>
    );
};

export default Submit;
