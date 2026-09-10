import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Add as IconPlus } from '@mui/icons-material';
import {
    Button,
    Paper,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';

import type { IProps } from './TransactorTable.types';

import { ffBlankTransactorRowEditable } from '../../../../utils/factoryFunctions';
import TransactorRow from '../TransactorRow';

const TransactorTable: FC<IProps> = ({ setTransactors, transactors }) => {
    const { t } = useTranslation();
    return (
        <Paper sx={{ flex: 1 }}>
            <MuiTable size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell
                            aria-label={t('literals.expand')}
                        ></TableCell>
                        <TableCell
                            aria-label={t('literals.numberOfSchedulers')}
                        ></TableCell>
                        <TableCell>{t('literals.Category')}</TableCell>
                        <TableCell>{t('literals.Description')}</TableCell>
                        <TableCell>{t('literals.Amount')}</TableCell>
                        <TableCell>{t('buttons.addOrSubtract')}</TableCell>
                        <TableCell>{t('buttons.Delete')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactors.map((datum) => (
                        <TransactorRow
                            key={datum.id}
                            setTransactors={setTransactors}
                            transactor={datum}
                            transactors={transactors}
                        />
                    ))}
                </TableBody>
            </MuiTable>
            <Button
                onClick={() => {
                    setTransactors([
                        ...transactors,
                        ffBlankTransactorRowEditable(),
                    ]);
                }}
                sx={{ my: 2 }}
            >
                <IconPlus /> {t('buttons.addBudgetRow')}
            </Button>
        </Paper>
    );
};

export default TransactorTable;
