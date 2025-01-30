import {
    FC,
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { Button, TableCell, TextField } from '@mui/material';

import { IProps } from './TransactionDescription.types';
import {
    toggleSideBar,
    TransactionEditContext,
    updateDescription,
} from '../../../../../../contexts/transactionEditContext';

/**
 * Renders the description column as a button to activate the Category Quick Add and with edit capabilities.
 * @component
 * @category Components
 * @subcategory Transaction Edit
 */
const TransactionDescription: FC<IProps> = ({ idx, title }) => {
    const { dispatch } = useContext(TransactionEditContext);

    const [editOpen, setEditOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
        setInternalValue(title);
    }, [title]);

    const handleClickTitle = useCallback(
        (match: string) => {
            dispatch(toggleSideBar(true, match));
        },
        [dispatch],
    );

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
                            console.log('save');
                            dispatch(updateDescription(idx, internalValue));
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
