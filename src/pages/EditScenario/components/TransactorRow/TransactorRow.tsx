import { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
} from '@mui/material';
import {
    Add as IconCreate,
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

    return (
        <ListItem sx={{ p: 0, mb: 1 }}>
            <Paper title={transactor.deleted ? t('row deleted') : undefined}>
                <Box
                    sx={{
                        width: '100%',
                        p: '8px 16px',
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr 1fr 100px',
                        alignItems: 'center',
                        gridGap: '16px',
                    }}
                >
                    <TextField
                        disabled={transactor.deleted}
                        label={t('literals.Description')}
                        onChange={handleChangeDesc}
                        sx={{
                            '& * ': {
                                textDecoration: transactor.deleted
                                    ? 'line-through'
                                    : 'none',
                            },
                        }}
                        value={transactor.description}
                    />
                    <TextField
                        disabled={transactor.deleted}
                        label={t('literals.Amount')}
                        onChange={handleChangeValue}
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
                    <Select
                        onChange={handleChangeIsAddition}
                        value={transactor.isAddition ? 'y' : 'n'}
                    >
                        <MenuItem value='y'>{t('literals.Add')}</MenuItem>
                        <MenuItem value='n'>{t('literals.Subtract')}</MenuItem>
                    </Select>
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
                </Box>
                <Accordion>
                    <AccordionSummary>
                        {transactor.schedulers.length
                            ? t('Scenario.numSchedules', {
                                  num: transactor.schedulers.length,
                              })
                            : t('Scenario.scheduleThisEvent')}
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </ListItem>
    );
};

export default TransactorRow;
