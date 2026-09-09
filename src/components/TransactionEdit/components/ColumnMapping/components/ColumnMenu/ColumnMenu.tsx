import { type FC, Fragment, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
    MenuItem,
    Select,
    type SelectChangeEvent,
    Typography,
} from '@mui/material';

import type { IProps } from './ColumnMenu.types';

import {
    TransactionEditContext,
    columnMappingCols,
} from '../../../../../../contexts/transactionEditContext';

export const ColumnMenu: FC<IProps> = ({
    localColumnMap,
    setLocalColumnMap,
}) => {
    const { t } = useTranslation();

    const {
        state: { headers },
    } = useContext(TransactionEditContext);

    const handleChange = (event: SelectChangeEvent) => {
        setLocalColumnMap({
            ...localColumnMap,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Fragment>
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
            {columnMappingCols.map((column) => (
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
        </Fragment>
    );
};

export default ColumnMenu;
