import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table as MuiTable,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Paper,
} from '@mui/material';

import { IProps } from './TransactorTable.types';
import TransactorRow from '../TransactorRow';

const TransactorTable: FC<IProps> = ({ setTransactors, transactors }) => {
    const { t } = useTranslation();
    return (
        <Paper>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        <TableCell
                            aria-label={t('literals.expand')}
                        ></TableCell>
                        <TableCell
                            aria-label={t('literals.numberOfSchedulers')}
                        ></TableCell>
                        <TableCell>{t('literals.Description')}</TableCell>
                        <TableCell>{t('literals.Amount')}</TableCell>
                        <TableCell>{t('buttons.addOrSubtract')}</TableCell>
                        <TableCell>{t('literals.Delete')}</TableCell>
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
        </Paper>
    );
};

export default TransactorTable;
