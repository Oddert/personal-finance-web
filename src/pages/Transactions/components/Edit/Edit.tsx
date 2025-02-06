import {
    FC,
    Fragment,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';
import { v4 as uuid } from 'uuid';

import { Box, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import {
    setColumnMap,
    setMode,
    tecWriteTransactions,
    TransactionEditContext,
    transactionEditInitialState,
    transactionEditReducer,
} from '../../../../contexts/transactionEditContext';
import { TransactionRange } from '../../../../contexts/transactionRangeContext';

import {
    getActiveLanguageCode,
    getUserCurrencies,
} from '../../../../redux/selectors/profileSelectors';

import useTransactions from '../../../../hooks/useTransactions';
import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

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

    const language = useAppSelector(getActiveLanguageCode);
    const currencies = useAppSelector(getUserCurrencies);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const filteredTransactions = transactions.map((transaction) => ({
            ...transaction,
            date: new Date(transaction.date).toLocaleDateString(language),
            credit: transaction.credit === 0 ? '-' : transaction.credit,
            debit: transaction.debit === 0 ? '-' : transaction.debit,
            categoryId: transaction.categoryId || 0,
            assignedCategory: transaction.categoryId || 0,
            selected: 1,
            tecTempId: uuid(),
            currency: currencies[0],
        }));
        dispatch(
            setColumnMap({
                date: 'date',
                transactionType: 'transactionType',
                description: 'description',
                debit: 'debit',
                credit: 'credit',
                ballance: 'ballance',
                id: 'id',
            }),
        );
        dispatch(tecWriteTransactions(filteredTransactions));
        dispatch(setMode('edit'));
    }, [currencies, language, rangeValues, transactions, value]);

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
