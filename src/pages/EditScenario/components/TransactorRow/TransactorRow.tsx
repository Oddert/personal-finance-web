import { ChangeEvent, FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import {
    Button,
    Collapse,
    IconButton,
    List,
    MenuItem,
    Select,
    SelectChangeEvent,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Add as IconCreate,
    ChevronRight as IconExpandClosed,
    ExpandMore as IconExpandOpen,
    Delete as IconDelete,
    DeleteForever as IconUnDelete,
} from '@mui/icons-material';

import { IScheduler } from '../../../../types/Scenario.types';

import SchedulerRow from '../SchedulerRow';

import type { IProps } from './TransactorRow.types';

/**
 * Displays a single transactor row, representing one type of transaction.
 * @component
 * @category Pages
 * @subcategory Edit Scenario
 */
const TransactorRow: FC<IProps> = ({
    setTransactors,
    transactor,
    transactors,
}) => {
    const [expanded, setExpanded] = useState(false);

    const { t } = useTranslation();

    const handleChangeValue = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const filteredRows = transactors.map((row) => {
            if (row.id === transactor.id) {
                return {
                    ...row,
                    value: Number(event.target.value),
                };
            }
            return row;
        });
        setTransactors(filteredRows);
    };

    const handleChangeDesc = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const filteredRows = transactors.map((row) => {
            if (row.id === transactor.id) {
                return {
                    ...row,
                    description: event.target.value,
                };
            }
            return row;
        });
        setTransactors(filteredRows);
    };

    const handleChangeIsAddition = (event: SelectChangeEvent<'y' | 'n'>) => {
        const filteredRows = transactors.map((row) => {
            if (row.id === transactor.id) {
                return {
                    ...row,
                    isAddition: event.target.value === 'y' ? true : false,
                };
            }
            return row;
        });
        setTransactors(filteredRows);
    };

    const handleClickDelete = () => {
        if (transactor.staged) {
            setTransactors(
                transactors.filter((row) => row.id !== transactor.id),
            );
        } else {
            const filteredRows = transactors.map((row) => {
                if (row.id === transactor.id) {
                    return {
                        ...row,
                        deleted: true,
                    };
                }
                return row;
            });
            setTransactors(filteredRows);
        }
    };

    const handleClickUndelete = () => {
        const filteredRows = transactors.map((row) => {
            if (row.id === transactor.id) {
                return {
                    ...row,
                    deleted: false,
                };
            }
            return row;
        });
        setTransactors(filteredRows);
    };

    const handleChangeScheduler =
        (schedulerId: string) => (scheduler: IScheduler) => {
            const filteredRows = transactors.map((transactorRow) => {
                if (transactorRow.id === transactor.id) {
                    return {
                        ...transactorRow,
                        schedulers: transactorRow.schedulers.map(
                            (schedulerRow) => {
                                if (schedulerRow.id === schedulerId) {
                                    return scheduler;
                                }
                                return schedulerRow;
                            },
                        ),
                    };
                }
                return transactorRow;
            });
            setTransactors(filteredRows);
        };

    const handleClickDeleteScheduler = (schedulerId: string) => () => {
        const filteredRows = transactors.map((transactorRow) => {
            if (transactorRow.id === transactor.id) {
                return {
                    ...transactorRow,
                    schedulers: transactorRow.schedulers.filter(
                        (schedulerRow) => schedulerRow.id !== schedulerId,
                    ),
                };
            }
            return transactorRow;
        });
        setTransactors(filteredRows);
    };

    const handleClickAddScheduler = () => {
        const filteredRows = transactors.map((transactorRow) => {
            if (transactorRow.id === transactor.id) {
                return {
                    ...transactorRow,
                    schedulers: [
                        ...transactorRow.schedulers,
                        {
                            id: uuid(),
                            createdOn: '',
                            updatedOn: '',
                            schedulerCode: 'DAY',
                            step: null,
                            startDate: null,
                            day: 0,
                            nthDay: null,
                            transactorId: '',
                        } as IScheduler,
                    ],
                };
            }
            return transactorRow;
        });
        setTransactors(filteredRows);
    };

    const toggleExpanded = () => setExpanded(!expanded);

    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        onClick={toggleExpanded}
                        title={
                            expanded
                                ? 'click to collapse schedulers'
                                : 'click to open schedulers'
                        }
                    >
                        {expanded ? <IconExpandOpen /> : <IconExpandClosed />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography>
                        {transactor.schedulers.length
                            ? transactor.schedulers.length > 1
                                ? t('Scenario.numSchedules', {
                                      num: transactor.schedulers.length,
                                  })
                                : t('Scenario.numScheduleSingle')
                            : t('Scenario.scheduleThisEvent')}
                    </Typography>
                </TableCell>
                <TableCell>
                    <TextField
                        disabled={transactor.deleted}
                        label={t('literals.Description')}
                        onChange={handleChangeDesc}
                        size='small'
                        sx={{
                            '& * ': {
                                textDecoration: transactor.deleted
                                    ? 'line-through'
                                    : 'none',
                            },
                        }}
                        value={transactor.description}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        disabled={transactor.deleted}
                        label={t('literals.Amount')}
                        onChange={handleChangeValue}
                        size='small'
                        sx={{
                            '& * ': {
                                textDecoration: transactor.deleted
                                    ? 'line-through'
                                    : 'none',
                            },
                        }}
                        type='number'
                        value={transactor.value}
                    />
                </TableCell>
                <TableCell>
                    <Select
                        onChange={handleChangeIsAddition}
                        size='small'
                        value={transactor.isAddition ? 'y' : 'n'}
                    >
                        <MenuItem value='y'>{t('literals.Add')}</MenuItem>
                        <MenuItem value='n'>{t('literals.Subtract')}</MenuItem>
                    </Select>
                </TableCell>
                <TableCell>
                    {transactor.deleted ? (
                        <Tooltip title={t('Budget.rowDeletedCLickToRestore')}>
                            <Button onClick={handleClickUndelete}>
                                <IconUnDelete />
                            </Button>
                        </Tooltip>
                    ) : (
                        <Tooltip title={t('Budget.deleteRow')}>
                            <Button onClick={handleClickDelete}>
                                <IconDelete />
                            </Button>
                        </Tooltip>
                    )}
                </TableCell>
            </TableRow>
            <Collapse in={expanded} unmountOnExit>
                <TableRow>
                    <TableCell colSpan={6}>
                        <List>
                            {transactor.schedulers.map((scheduler, idx) => (
                                <SchedulerRow
                                    handleClickDeleteScheduler={handleClickDeleteScheduler(
                                        scheduler.id,
                                    )}
                                    handleChangeScheduler={handleChangeScheduler(
                                        scheduler.id,
                                    )}
                                    key={idx}
                                    scheduler={scheduler}
                                />
                            ))}
                            <Button onClick={handleClickAddScheduler}>
                                <IconCreate /> {t('Scenario.addSchedule')}
                            </Button>
                        </List>
                    </TableCell>
                </TableRow>
            </Collapse>
        </Fragment>
    );
};

export default TransactorRow;
