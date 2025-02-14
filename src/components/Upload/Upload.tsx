import { Fragment, useCallback, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

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

import { getCategoryResponse } from '../../redux/selectors/categorySelectors';

import TransactionEdit from '../TransactionEdit';
import DropZone from '../DropZone';
import { getUserCurrencies } from '../../redux/selectors/profileSelectors';

/**
 * Allows the user to upload new transactions.
 * @category Components
 * @subcategory Upload
 * @component
 */
const Upload = () => {
    const [state, dispatch] = useReducer(
        transactionEditReducer,
        transactionEditInitialState,
    );

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
                            const withSelected = withCategories.map(
                                (datum) => ({
                                    ...datum,
                                    selected: 1,
                                    tecTempId: uuid(),
                                    currency: currencies[0],
                                }),
                            );
                            dispatch(writeHeaders(headers));
                            dispatch(tecWriteTransactions(withSelected));
                            dispatch(setLoading(false));
                        }
                    };
                    reader.readAsText(file);
                });
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
