import {
    FC,
    Fragment,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';
import { Button } from '@mui/material';

import { LOCALE } from '../../../../constants/appConstants';

import {
    setColumnMap,
    setMode,
    TransactionEditContext,
    transactionEditInitialState,
    transactionEditReducer,
    writeTransactions,
} from '../../../../contexts/transactionEditContext';
import { TransactionRange } from '../../../../contexts/transactionRangeContext';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import { getTransactionsResponse } from '../../../../redux/selectors/transactionsSelectors';

import TransactionEdit from '../../../../components/TransactionEdit/TransactionEdit';

import type { IProps } from './Edit.types';

/**
 * Modal to edit all transactions currently selected in the view.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const Edit: FC<IProps> = () => {
    const {
        state: { rangeValues, value },
    } = useContext(TransactionRange);

    const [state, dispatch] = useReducer(
        transactionEditReducer,
        transactionEditInitialState,
    );

    const transactions = useAppSelector(getTransactionsResponse);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const minDate = rangeValues[value[0]]?.bottom;
        const maxDate = rangeValues[value[1]]?.top;

        const filteredTransactions = transactions
            .filter(
                (transaction) =>
                    transaction.date >= minDate && transaction.date <= maxDate,
            )
            .map((transaction) => ({
                ...transaction,
                date: new Date(transaction.date).toLocaleDateString(LOCALE),
                credit: transaction.credit === 0 ? '-' : transaction.credit,
                debit: transaction.debit === 0 ? '-' : transaction.debit,
                category_id: transaction.category_id || 0,
                assignedCategory: transaction.category_id || 0,
            }));
        dispatch(
            setColumnMap({
                date: 'date',
                transaction_type: 'transaction_type',
                description: 'description',
                debit: 'debit',
                credit: 'credit',
                ballance: 'ballance',
                id: 'id',
            }),
        );
        dispatch(writeTransactions(filteredTransactions));
        dispatch(setMode('edit'));
    }, [rangeValues, value, transactions]);

    return (
        <Fragment>
            <Button onClick={() => setOpen(true)}>
                Edit transactions in range
            </Button>
            {open ? (
                <TransactionEditContext.Provider value={{ state, dispatch }}>
                    <TransactionEdit
                        open={open}
                        onClose={() => setOpen(false)}
                    />
                </TransactionEditContext.Provider>
            ) : null}
        </Fragment>
    );
};
export default Edit;
