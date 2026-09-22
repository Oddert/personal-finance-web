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
                            size='small'
                        ></TableCell>
                        <TableCell size='small'>
                            {t('Scenario.Scheduler.numberOfSchedulers')}
                        </TableCell>
                        <TableCell size='small'>{t('literals.Card')}</TableCell>
                        <TableCell size='small'>
                            {t('literals.Category')}
                        </TableCell>
                        <TableCell size='small'>
                            {t('literals.Description')}
                        </TableCell>
                        <TableCell size='small'>
                            {t('literals.Amount')}
                        </TableCell>
                        <TableCell size='small'>
                            {t('buttons.Action')}
                        </TableCell>
                        <TableCell size='small'>
                            {t('buttons.Delete')}
                        </TableCell>
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
