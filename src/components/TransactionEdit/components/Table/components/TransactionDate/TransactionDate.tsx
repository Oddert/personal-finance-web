import { useContext, useEffect, useState, type FC } from 'react';

import type { IProps } from './TransactionDate.types';
import { useTranslation } from 'react-i18next';
import { changeDateValue, TransactionEditContext } from '../../../../../../contexts/transactionEditContext';
import { Box, Button, TableCell, TextField, Tooltip, Typography } from '@mui/material';

import { Edit as IconEdit } from '@mui/icons-material';
import dayjs from 'dayjs';

const TransactionDate: FC<IProps> = ({transaction}) => {
    const { t } = useTranslation();

    const {
        dispatch,
        state: { columnMap, dateFormat },
    } = useContext(TransactionEditContext);

    const [editOpen, setEditOpen] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInternalValue(transaction[columnMap.date] as string);
    }, [columnMap, transaction]);

    const date = dayjs.utc(
        transaction[columnMap.date],
        dateFormat,
        true,
    );

    const existingDateStr = String(transaction[columnMap.date] ?? '')

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
                <Box sx={{
                display: 'flex',
                alignItems: 'center',}}>
                    <TextField
                        label={t('Transaction.transactionDescriptionLabel')}
                        name='description'
                        onChange={(event) => {
                            setInternalValue(event.target.value);
                        }}
                        value={internalValue}
                    />
                    <Button
                        onClick={() => {
                            setEditOpen(false);
                            setInternalValue(existingDateStr);
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
                                changeDateValue(
                                    transaction.tecTempId as string,
                                    internalValue,
                                ),
                            );
                        }}
                        title={t('Transaction.clickToSaveDescription')}
                    >
                        Save
                    </Button>
                </Box>
            ) : (
                <Box sx={{
                display: 'flex',
                alignItems: 'center',}}>
                    <Tooltip title={transaction[columnMap.date]}>
                                            <Typography>
                                                {(date.isValid() ? date : dayjs()).toISOString()}
                                            </Typography>
                                        </Tooltip>
                    <Button
                        className='transaction_description_edit'
                        onClick={() => {
                            setEditOpen(true);
                        }}
                        title={t('Transaction.clickToEditDescription')}
                    >
                        <IconEdit />
                    </Button>
                </Box>
            )}
        </TableCell>
    );
};

export default TransactionDate;
