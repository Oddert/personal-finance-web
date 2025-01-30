import {
    FC,
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { Button, TableCell, TextField } from '@mui/material';

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
    const {
        dispatch,
        state: { columnMap },
    } = useContext(TransactionEditContext);

    const [editOpen, setEditOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
        setInternalValue(transaction[columnMap.description] as string);
    }, [transaction]);

    const handleClickTitle = useCallback(
        (match: string) => {
            dispatch(toggleSideBar(true, match));
        },
        [dispatch],
    );

    const title = transaction[columnMap.description] as string;

    return (
        <TableCell>
            {editOpen ? (
                <Fragment>
                    <TextField
                        label='Transaction description'
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
                        title='Click to cancel the description edit'
                    >
                        Discard changes
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
                        title='Click to save the edited description'
                    >
                        Save
                    </Button>
                </Fragment>
            ) : (
                <Fragment>
                    <Button
                        onClick={() => handleClickTitle(title)}
                        title='Click to add a new Category auto-matcher'
                        variant='text'
                    >
                        {title}
                    </Button>
                    <Button
                        className='transaction_description_edit'
                        onClick={() => setEditOpen(true)}
                        title='Click to edit the description'
                    >
                        Edit
                    </Button>
                </Fragment>
            )}
        </TableCell>
    );
};

export default TransactionDescription;
