import { Fragment, useCallback, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { v4 as uuid } from 'uuid';

import { PERSONAL_FINANCE_CSV_MAPPING } from '../../constants/appConstants';

import { readCsv } from '../../utils/commonUtils';
import { autoMatchCategories } from '../../utils/uploadUtils';

import {
    transactionEditInitialState,
    TransactionEditContext,
    transactionEditReducer,
    writeHeaders,
    setColumnMap,
    setLoading,
    tecWriteTransactions,
} from '../../contexts/transactionEditContext';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import { getCategoryResponse } from '../../redux/selectors/categorySelectors';
import { getUserCurrencies } from '../../redux/selectors/profileSelectors';
import { checkAuth } from '../../redux/thunks/authThunks';

import TransactionEdit from '../TransactionEdit';
import DropZone from '../DropZone';

/**
 * Allows the user to upload new transactions.
 * @category Components
 * @subcategory Upload
 * @component
 */
const Upload = () => {
    const reduxDispatch = useAppDispatch();

    const [state, dispatch] = useReducer(
        transactionEditReducer,
        transactionEditInitialState,
    );

    const { t } = useTranslation();

    const categories = useSelector(getCategoryResponse);
    const currencies = useSelector(getUserCurrencies);

    const [modalOpen, setModalOpen] = useState(false);

    const handleChange = useCallback(
        (files: File[] | null) => {
            dispatch(setLoading(true));
            if (files) {
                const transactions: { [key: string]: string | number }[] = [];
                let headers: string[] = [];

                files.forEach((file, idx) => {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const readValues = readCsv(evt?.target?.result);
                        if (readValues) {
                            if (!headers.length) {
                                headers = readValues.headers;
                            }
                            transactions.push(...readValues.values);
                        }
                        if (idx === files.length - 1) {
                            const withCategories = autoMatchCategories(
                                transactions,
                                categories,
                            );
                            const withPresets = withCategories.map((datum) => ({
                                ...datum,
                                selected: 1,
                                deleted: 0,
                                tecTempId: uuid(),
                                currency: currencies[0],
                            }));
                            dispatch(writeHeaders(headers));
                            dispatch(tecWriteTransactions(withPresets));
                            dispatch(setLoading(false));
                        }
                    };
                    reader.readAsText(file);
                });
                reduxDispatch(checkAuth());
                setModalOpen(true);
            }
        },
        [categories, currencies],
    );

    useEffect(() => {
        const mapping = localStorage.getItem(PERSONAL_FINANCE_CSV_MAPPING);
        if (mapping) {
            dispatch(
                setColumnMap(JSON.parse(mapping) as { [key: string]: string }),
            );
        } else {
            localStorage.setItem(
                PERSONAL_FINANCE_CSV_MAPPING,
                JSON.stringify(transactionEditInitialState.columnMap),
            );
        }
    }, []);

    return (
        <Fragment>
            <DropZone onSuccess={handleChange} />
            <Button onClick={() => setModalOpen(true)}>
                {t('Transaction.enterTransactionsManually')}
            </Button>
            <TransactionEditContext.Provider value={{ state, dispatch }}>
                <TransactionEdit
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    showMapping
                />
            </TransactionEditContext.Provider>
        </Fragment>
    );
};

export default Upload;
