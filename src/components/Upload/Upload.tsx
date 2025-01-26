import { Fragment, useCallback, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import { PERSONAL_FINANCE_CSV_MAPPING } from '../../constants/appConstants';

import { readCsv } from '../../utils/commonUtils';
import { autoMatchCategories } from '../../utils/uploadUtils';

import {
    transactionEditInitialState,
    TransactionEditContext,
    transactionEditReducer,
    writeHeaders,
    writeTransactions,
    setColumnMap,
    setLoading,
} from '../../contexts/transactionEditContext';

import { getCategoryResponse } from '../../redux/selectors/categorySelectors';

import TransactionEdit from '../TransactionEdit';
import DropZone from '../DropZone';

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
                            dispatch(writeHeaders(headers));
                            dispatch(writeTransactions(withCategories));
                            dispatch(setLoading(false));
                        }
                    };
                    reader.readAsText(file);
                });
                setModalOpen(true);
            }
        },
        [categories],
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
