import { FC, useContext } from 'react';

import { IconButton, TableCell } from '@mui/material';
import {
    Delete as IconDelete,
    SettingsBackupRestore as IconUnDelete,
} from '@mui/icons-material';

import {
    toggleDeleted,
    TransactionEditContext,
} from '../../../../../../contexts/transactionEditContext';

import { IProps } from './DeleteOption.types';

/**
 * Renders the toggle delete button.
 * @component
 * @category Components
 * @category Transaction Edit
 * @param props.idx The transaction index.
 * @param props.transaction The transaction row.
 */
const DeleteOption: FC<IProps> = ({ transaction }) => {
    const { dispatch } = useContext(TransactionEditContext);

    return (
        <TableCell>
            {transaction.deleted ? (
                <IconButton
                    onClick={() =>
                        dispatch(toggleDeleted(transaction.tecTempId as string))
                    }
                    title='restore this row (undo delete)'
                >
                    <IconUnDelete />
                </IconButton>
            ) : (
                <IconButton
                    onClick={() =>
                        dispatch(toggleDeleted(transaction.tecTempId as string))
                    }
                    title='delete this row'
                >
                    <IconDelete />
                </IconButton>
            )}
        </TableCell>
    );
};

export default DeleteOption;
