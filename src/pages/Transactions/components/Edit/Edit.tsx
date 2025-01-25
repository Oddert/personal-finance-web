import {
    FC,
    Fragment,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';
import { Box, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

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

import useTransactions from '../../../../hooks/useTransactions';

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

    const { transactions } = useTransactions(
        rangeValues[value[0]]?.bottom,
        rangeValues[value[1]]?.top,
    );

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const filteredTransactions = transactions.map((transaction) => ({
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button
                    onClick={() => setOpen(true)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gridGap: '16px',
                    }}
                >
                    Edit transactions in range <EditIcon />
                </Button>
            </Box>
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
