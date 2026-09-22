import {
    type ChangeEvent,
    type FC,
    Fragment,
    type SyntheticEvent,
    useMemo,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
    Add as IconCreate,
    ChevronRight as IconExpandClosed,
    Delete as IconDelete,
    DeleteForever as IconUnDelete,
    ExpandMore as IconExpandOpen,
} from '@mui/icons-material';
import {
    Autocomplete,
    Button,
    Chip,
    Collapse,
    IconButton,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';

import { v4 as uuid } from 'uuid';

import type { IProps } from './TransactorRow.types';
import type { ICard } from '../../../../types/Card.types';
import type { ICategory } from '../../../../types/Category';
import type { IScheduler } from '../../../../types/Scenario.types';
import type { ITransactorRowEditable } from '../../EditScenario.types';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../../../redux/selectors/cardSelectors';
import { getCategoryResponse } from '../../../../redux/selectors/categorySelectors';
import SchedulerRow from '../SchedulerRow';

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

    const allCategories = useAppSelector(getCategoryResponse);
    const allCards = useAppSelector(getCardResponse);

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
                        schedulers:
                            transactorRow.schedulers?.map((schedulerRow) => {
                                if (schedulerRow.id === schedulerId) {
                                    return scheduler;
                                }
                                return schedulerRow;
                            }) ?? [],
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
                    schedulers:
                        transactorRow.schedulers?.filter(
                            (schedulerRow) => schedulerRow.id !== schedulerId,
                        ) ?? [],
                };
            }
            return transactorRow;
        });
        setTransactors(filteredRows);
    };

    const handleClickAddScheduler = () => {
        const filteredRows: ITransactorRowEditable[] = transactors.map(
            (transactorRow) => {
                if (transactorRow.id === transactor.id) {
                    return {
                        ...transactorRow,
                        schedulers: [
                            ...(transactorRow.schedulers ?? []),
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
                            },
                        ],
                    };
                }
                return transactorRow;
            },
        );
        setTransactors(filteredRows);
    };

    const handleChangeCategory = (
        _: SyntheticEvent,
        value: ICategory | null,
    ) => {
        const filteredRows: ITransactorRowEditable[] = transactors.map(
            (transactorRow) => {
                if (transactorRow.id === transactor.id) {
                    return {
                        ...transactorRow,
                        categoryId: value ? value.id : null,
                    };
                }
                return transactorRow;
            },
        );
        setTransactors(filteredRows);
    };

    const handleChangeCard = (_: SyntheticEvent, value: ICard | null) => {
        const filteredRows: ITransactorRowEditable[] = transactors.map(
            (transactorRow) => {
                if (transactorRow.id === transactor.id) {
                    return {
                        ...transactorRow,
                        cardId: value ? value.id : null,
                    };
                }
                return transactorRow;
            },
        );
        setTransactors(filteredRows);
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const category = useMemo(() => {
        return (
            allCategories.find((cat) => cat.id === transactor.categoryId) ??
            null
        );
    }, [allCategories, transactor.categoryId]);

    const card = useMemo(() => {
        return allCards.find((_card) => _card.id === transactor.cardId) ?? null;
    }, [allCards, transactor.cardId]);

    return (
        <Fragment>
            <TableRow
                sx={{
                    borderLeft: category
                        ? `5px solid ${category.colour}`
                        : '5px solid transparent',
                }}
            >
                <TableCell size='small' sx={{ px: '4px' }}>
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
                <TableCell size='small' sx={{ px: '4px' }}>
                    <Chip label={transactor.schedulers?.length ?? 0} />
                </TableCell>
                <TableCell size='small' sx={{ px: '4px' }}>
                    <Autocomplete
                        getOptionKey={(opt) => opt.id}
                        getOptionLabel={(opt) => opt.cardName}
                        onChange={handleChangeCard}
                        options={allCards}
                        renderInput={(props) => (
                            <TextField
                                sx={{ minWidth: '150px' }}
                                {...props}
                                size='small'
                            />
                        )}
                        value={card}
                    />
                </TableCell>
                <TableCell size='small' sx={{ px: '4px' }}>
                    <Autocomplete
                        getOptionKey={(opt) => opt.id}
                        getOptionLabel={(opt) => opt.label}
                        onChange={handleChangeCategory}
                        options={allCategories}
                        renderInput={(props) => (
                            <TextField
                                placeholder='- no category -'
                                sx={{ minWidth: '150px' }}
                                {...props}
                                size='small'
                            />
                        )}
                        value={category}
                    />
                </TableCell>
                <TableCell size='small' sx={{ px: '4px' }}>
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
                <TableCell size='small' sx={{ px: '4px' }}>
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
                <TableCell size='small' sx={{ px: '4px' }}>
                    <Select
                        onChange={handleChangeIsAddition}
                        size='small'
                        value={transactor.isAddition ? 'y' : 'n'}
                    >
                        <MenuItem value='y'>{t('literals.Add')}</MenuItem>
                        <MenuItem value='n'>{t('literals.Subtract')}</MenuItem>
                    </Select>
                </TableCell>
                <TableCell size='small' sx={{ px: '4px' }}>
                    {transactor.deleted ? (
                        <Tooltip title={t('Budget.rowDeletedClickToRestore')}>
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
            <TableRow>
                <TableCell
                    colSpan={6}
                    sx={{ py: 0, px: 8, borderBottom: 'none' }}
                >
                    <Collapse in={expanded} unmountOnExit>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell size='small' sx={{ px: '4px' }}>
                                        {t('Scenario.Scheduler.schedulerType')}
                                    </TableCell>
                                    <TableCell size='small' sx={{ px: '4px' }}>
                                        {t('literals.Options')}
                                    </TableCell>
                                    <TableCell size='small' sx={{ px: '4px' }}>
                                        {t('buttons.Delete')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactor.schedulers?.map(
                                    (scheduler, idx) => (
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
                                    ),
                                ) ?? []}
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <Button
                                            onClick={handleClickAddScheduler}
                                        >
                                            <IconCreate />{' '}
                                            {t('Scenario.addSchedule')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};

export default TransactorRow;
