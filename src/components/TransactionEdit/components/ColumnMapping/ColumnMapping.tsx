import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Dialog,
    MenuItem,
    Paper,
    Select,
    Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

import { PERSONAL_FINANCE_CSV_MAPPING } from '../../../../constants/appConstants';

import {
    defaultColumns,
    setColumnMap,
    TransactionEditContext,
} from '../../../../contexts/transactionEditContext';

/**
 * Allows the user to change the mapping between the uploaded CSV columns and the data columns used by the application.
 * @category Components
 * @subcategory Transaction Edit
 * @component
 */
const ColumnMapping = () => {
    const { t } = useTranslation();

    const {
        dispatch,
        state: { columnMap, headers },
    } = useContext(TransactionEditContext);

    const [open, setOpen] = useState(false);
    const [localColumnMap, setLocalColumnMap] = useState<{
        [key: string]: string;
    }>({});

    useEffect(() => {
        setLocalColumnMap(columnMap);
    }, [columnMap]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        setLocalColumnMap({
            ...localColumnMap,
            [event.target.name]: event.target.value,
        });
    };

    const handleClickOpen = () => setOpen(true);

    const handleClickCancel = useCallback(() => {
        setLocalColumnMap(columnMap);
        setOpen(false);
    }, [columnMap]);

    const handleClickSave = useCallback(() => {
        dispatch(setColumnMap(localColumnMap));
        setOpen(false);
        localStorage.setItem(
            PERSONAL_FINANCE_CSV_MAPPING,
            JSON.stringify(localColumnMap),
        );
    }, [dispatch, localColumnMap]);

    return (
        <Fragment>
            <Dialog open={open} onClose={handleClickCancel}>
                <Paper
                    sx={{
                        padding: '24px 48px',
                        display: 'grid',
                        gridTemplateColumns: '200px 1fr',
                        gridAutoRows: 'auto',
                        gridGap: '12px',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{ gridColumn: '1 / span 2', marginBottom: '24px' }}
                        variant='h4'
                    >
                        {t('Transaction.mapCSVHeadersTitle')}
                    </Typography>
                    <Typography
                        sx={{
                            gridColumn: '1 / span 2',
                            marginBottom: '24px',
                        }}
                        variant='subtitle1'
                    >
                        {t('Transaction.mapCSVHeadersDesc')}
                    </Typography>
                    {defaultColumns.map((column) => (
                        <Fragment key={column.accessorKey}>
                            <Typography
                                component='label'
                                htmlFor={`col-${column.header}`}
                            >
                                {column.header}
                            </Typography>
                            <Select
                                defaultValue=''
                                id={`col-${column.header}`}
                                name={column.accessorKey}
                                onChange={handleChange}
                                value={localColumnMap[column.accessorKey] || ''}
                            >
                                <MenuItem value={''}>
                                    - {t('literals.Unset')} -
                                </MenuItem>
                                {[...headers].map((header, idx) => (
                                    <MenuItem key={idx} value={header}>
                                        {header}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Fragment>
                    ))}
                    <Box
                        sx={{
                            gridColumn: '1 / span 2',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button onClick={handleClickCancel}>
                            {t('Cancel')}
                        </Button>
                        <Button
                            onClick={handleClickSave}
                            sx={{ marginLeft: '4px' }}
                            variant='contained'
                        >
                            {t('buttons.saveChanges')}
                        </Button>
                    </Box>
                </Paper>
            </Dialog>
            <Button onClick={handleClickOpen}>
                {t('Transaction.changeColumnMapping')}
            </Button>
        </Fragment>
    );
};

export default ColumnMapping;
