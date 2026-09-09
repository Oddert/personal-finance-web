import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Dialog, Paper } from '@mui/material';

import { PERSONAL_FINANCE_CSV_MAPPING } from '../../../../constants/appConstants';
import {
    TransactionEditContext,
    changeDateFormat,
    setColumnMap,
} from '../../../../contexts/transactionEditContext';

import ColumnMenu from './components/ColumnMenu';
import DateFormat from './components/DateFormat';

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
        state: { columnMap, dateFormat },
    } = useContext(TransactionEditContext);

    const [open, setOpen] = useState(false);
    const [localColumnMap, setLocalColumnMap] = useState<
        Record<string, string>
    >({});
    const [localDateFormat, setLocalDateFormat] = useState<string>('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalColumnMap(columnMap);
        setLocalDateFormat(dateFormat);
    }, [columnMap, dateFormat]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickCancel = useCallback(() => {
        setLocalColumnMap(columnMap);
        setLocalDateFormat(dateFormat);
        setOpen(false);
    }, [columnMap, dateFormat]);

    const handleClickSave = useCallback(() => {
        dispatch(setColumnMap(localColumnMap));
        dispatch(changeDateFormat(localDateFormat));
        setOpen(false);
        localStorage.setItem(
            PERSONAL_FINANCE_CSV_MAPPING,
            JSON.stringify(localColumnMap),
        );
    }, [dispatch, localColumnMap, localDateFormat]);

    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth='md'
                open={open}
                onClose={handleClickCancel}
            >
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
                    <DateFormat
                        localDateFormat={localDateFormat}
                        setLocalDateFormat={setLocalDateFormat}
                    />
                    <ColumnMenu
                        localColumnMap={localColumnMap}
                        setLocalColumnMap={setLocalColumnMap}
                    />
                    <Box
                        sx={{
                            gridColumn: '1 / span 2',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button onClick={handleClickCancel}>
                            {t('buttons.Cancel')}
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
                {t('buttons.changeColumnMapping')}
            </Button>
        </Fragment>
    );
};

export default ColumnMapping;
