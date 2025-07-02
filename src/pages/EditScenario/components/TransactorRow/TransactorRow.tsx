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
    styled,
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

const TextFieldStyled = styled(TextField)({});

const inputProps = {
    // sx: {
    //     '& input': {
    //         py: '10px',
    //     },
    // },
};

/**
 * Displays a single transactor row, representing one type of transaction.
 * @component
 * @category Pages
 * @subcategory Home
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
                    <TextFieldStyled
                        disabled={transactor.deleted}
                        label={'Description'}
                        onChange={handleChangeDesc}
                        slotProps={{
                            input: inputProps,
                        }}
                        sx={{
                            '& * ': {
                                textDecoration: transactor.deleted
                                    ? 'line-through'
                                    : 'none',
                            },
                        }}
                        value={transactor.description}
                    />
                    <TextFieldStyled
                        disabled={transactor.deleted}
                        label={'Amount'}
                        onChange={handleChangeValue}
                        slotProps={{
                            input: inputProps,
                        }}
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
                        <MenuItem value='y'>Add</MenuItem>
                        <MenuItem value='n'>Subtract</MenuItem>
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
                            ? `Schedules (${transactor.schedulers.length})`
                            : 'Schedule this event'}
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
                                <IconCreate /> Add schedule
                            </Button>
                        </List>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </ListItem>
    );
};

export default TransactorRow;
