import { FC, useContext, useEffect, useState } from 'react';

import { Box, Button, TableCell, TextField } from '@mui/material';

import {
    TransactionEditContext,
    updateNumericValue,
} from '../../../../../../contexts/transactionEditContext';

import { IProps } from './EditableNumber.types';

/**
 * Generic editable field used for numeric columns.
 * @component
 * @category Components
 * @subcategory Transaction Edit
 * @param props.colMapKey The key of the number field (use internal value as auto column-mapping is attempted within the component).
 * @param props.transaction The transaction row.
 */
const EditableNumber: FC<IProps> = ({ colMapKey, transaction }) => {
    const {
        dispatch,
        state: { columnMap },
    } = useContext(TransactionEditContext);

    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('0');

    const handleClose = () => {
        dispatch(
            updateNumericValue(
                transaction.tecTempId as string,
                colMapKey,
                internalValue,
            ),
        );
        setOpen(false);
    };

    const handleEnter = (event: KeyboardEvent) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            handleClose();
        }
    };

    useEffect(() => {
        const value =
            colMapKey in columnMap
                ? (transaction[columnMap[colMapKey]] as string)
                : (transaction[colMapKey] as string);
        setInternalValue(value);
    }, [transaction]);

    useEffect(() => {
        document.addEventListener('keypress', handleEnter);
        return () => document.removeEventListener('keypress', handleEnter);
    }, []);

    return (
        <TableCell>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {open ? (
                    <TextField
                        onBlur={handleClose}
                        onChange={(event) =>
                            setInternalValue(event.target.value)
                        }
                        size='small'
                        sx={{ '& input': { width: '100px' } }}
                        type='number'
                        value={internalValue}
                    />
                ) : (
                    <Button
                        onClick={() => setOpen(true)}
                        sx={{ textAlign: 'left' }}
                    >
                        {!internalValue || internalValue === '0'
                            ? '-'
                            : internalValue}
                    </Button>
                )}
            </Box>
        </TableCell>
    );
};

export default EditableNumber;
