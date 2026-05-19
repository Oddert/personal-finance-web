import {
    type FC,
    Fragment,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Edit as IconEdit } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

import { v4 as uuid } from 'uuid';

import type { IProps } from './Edit.types';

import { getFromLocalStore } from '../../../../common/localstore';
import TransactionEdit from '../../../../components/TransactionEdit/TransactionEdit';
import { PERSONAL_FINANCE_UPLOAD_RECOVERY } from '../../../../constants/appConstants';
import {
    TransactionEditContext,
    type TransactionEditState,
    createTECReducer,
    restoreState,
    setColumnMap,
    setMode,
    tecWriteTransactions,
    transactionEditInitialState,
} from '../../../../contexts/transactionEditContext';
import { TransactionRange } from '../../../../contexts/transactionRangeContext';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import useTransactions from '../../../../hooks/useTransactions';
import {
    getActiveLanguageCode,
    getUserCurrencies,
} from '../../../../redux/selectors/profileSelectors';
import { checkAuth } from '../../../../redux/thunks/authThunks';

/**
 * Modal to edit all transactions currently selected in the view.
 * @component
 * @category Pages
 * @subcategory Transactions
 */
const Edit: FC<IProps> = () => {
    const reduxDispatch = useAppDispatch();

    const { t } = useTranslation();

    const {
        state: { rangeValues, value },
    } = useContext(TransactionRange);

    const [state, dispatch] = useReducer(
        createTECReducer(),
        transactionEditInitialState,
    );

    const { transactions } = useTransactions(
        rangeValues[value[0]].bottom,
        rangeValues[value[1]].top,
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
            categoryId: transaction.categoryId ?? 0,
            assignedCategory: transaction.categoryId ?? 0,
            selected: 1,
            deleted: 0,
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
                currency: 'currency',
                id: 'id',
            }),
        );
        dispatch(tecWriteTransactions(filteredTransactions));
        dispatch(setMode('edit'));
    }, [currencies, language, rangeValues, transactions, value]);

    useEffect(() => {
        const recovery = getFromLocalStore(PERSONAL_FINANCE_UPLOAD_RECOVERY);
        if (recovery) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const nextState: Partial<TransactionEditState> =
                // @ts-expect-error unknown localstore response
                JSON.parse(recovery);
            dispatch(restoreState(nextState));
        }
    }, []);

    return (
        <Fragment>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Button
                    onClick={() => {
                        reduxDispatch(checkAuth());
                        setOpen(true);
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gridGap: '16px',
                    }}
                >
                    {t('Transaction.editInRange')} <IconEdit />
                </Button>
            </Box>
            {open ? (
                <TransactionEditContext.Provider value={{ state, dispatch }}>
                    <TransactionEdit
                        open={open}
                        onClose={() => {
                            setOpen(false);
                        }}
                    />
                </TransactionEditContext.Provider>
            ) : null}
        </Fragment>
    );
};
export default Edit;
