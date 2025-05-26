import {
    FC,
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Button, TableCell, TextField } from '@mui/material';
import { Edit as IconEdit } from '@mui/icons-material';

import {
    toggleSideBar,
    TransactionEditContext,
    updateDescription,
} from '../../../../../../contexts/transactionEditContext';

import { IProps } from './TransactionDescription.types';

/**
 * Renders the description column as a button to activate the Category Quick Add and with edit capabilities.
 * @component
 * @category Components
 * @subcategory Transaction Edit
 */
const TransactionDescription: FC<IProps> = ({ transaction }) => {
    const { t } = useTranslation();

    const {
        dispatch,
        state: { columnMap },
    } = useContext(TransactionEditContext);

    const [editOpen, setEditOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
        setInternalValue(transaction[columnMap.description] as string);
    }, [columnMap, transaction]);

    const handleClickTitle = useCallback(
        (match: string) => {
            dispatch(toggleSideBar(true, match));
        },
        [dispatch],
    );

    const title = transaction[columnMap.description] as string;

    return (
        <TableCell
            sx={{
                '& .transaction_description_edit': {
                    opacity: 0,
                    transition: '.1s linear',
                },
                '&:hover .transaction_description_edit': {
                    opacity: 1,
                },
            }}
        >
            {editOpen ? (
                <Fragment>
                    <TextField
                        label={t('Transaction.transactionDescriptionLabel')}
                        name='description'
                        onChange={(event) =>
                            setInternalValue(event.target.value)
                        }
                        value={internalValue}
                    />
                    <Button
                        onClick={() => {
                            setEditOpen(false);
                            setInternalValue(title);
                        }}
                        title={t(
                            'Transaction.transactionDescriptionEditCancel',
                        )}
                    >
                        {t('buttons.discardChanges')}
                    </Button>
                    <Button
                        onClick={() => {
                            setEditOpen(false);
                            dispatch(
                                updateDescription(
                                    transaction.tecTempId as string,
                                    internalValue,
                                ),
                            );
                        }}
                        title={t('Transaction.clickToSaveDescription')}
                    >
                        Save
                    </Button>
                </Fragment>
            ) : (
                <Fragment>
                    <Button
                        onClick={() => handleClickTitle(title)}
                        title={t('Transaction.clickToAddMatcher')}
                        variant='text'
                    >
                        {title}
                    </Button>
                    <Button
                        className='transaction_description_edit'
                        onClick={() => setEditOpen(true)}
                        title={t('Transaction.clickToEditDescription')}
                    >
                        <IconEdit />
                    </Button>
                </Fragment>
            )}
        </TableCell>
    );
};

export default TransactionDescription;
