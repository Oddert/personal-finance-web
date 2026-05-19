import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { json2csv } from 'json-2-csv';

import type { IProps } from './ExportTransactions.types';
import type { ICategory } from '../../types/Category';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../redux/selectors/cardSelectors';
import { getCategoryOrderedDataById } from '../../redux/selectors/categorySelectors';
import { intakeError } from '../../redux/thunks/errorThunks';
import APIService from '../../services/APIService';
import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../utils/budgetUtils';
import {
    createStandardTransactionDlName,
    downloadCsv,
    downloadCsvNoSuffix,
    downloadJson,
} from '../../utils/exportUtils';

dayjs.extend(localizedFormat);

/**
 * Allows the user to export all transactions within a selected range.
 * @component
 * @category Components
 * @subcategory Export Transactions
 */
const ExportTransactions: FC<IProps> = ({
    defaultEndDate,
    defaultStartDate,
}) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);
    const [previewCount, setPreviewCount] = useState(0);
    const [startDate, setStartDate] = useState(
        defaultStartDate
            ? dayjs(defaultStartDate)
            : toBeginningMonthDayjs(new Date()),
    );
    const [endDate, setEndDate] = useState(
        defaultEndDate ? dayjs(defaultEndDate) : toEndMonthDayjs(new Date()),
    );
    const [dlFormat, setDlFormat] = useState('csv');

    const activeCardId = useAppSelector(getActiveCardId);
    const categoriesById = useAppSelector(getCategoryOrderedDataById);

    useEffect(() => {
        if (activeCardId) {
            const getCount = async () => {
                try {
                    const res = await APIService.getTransactionCount(
                        startDate.valueOf(),
                        endDate.valueOf(),
                        activeCardId,
                    );

                    if (
                        res?.payload?.count &&
                        typeof res.payload.count === 'number'
                    ) {
                        setPreviewCount(res.payload.count);
                    }
                } catch (error) {
                    dispatch(intakeError(error));
                }
            };
            getCount();
        }
    }, [activeCardId, dispatch, endDate, startDate]);

    const handleClickExport = () => {
        const getTransactions = async () => {
            try {
                const res = await APIService.getAllTransactionsWithinRange(
                    startDate.valueOf(),
                    endDate.valueOf(),
                    activeCardId,
                );
                const withCategories = (res.payload?.transactions ?? []).map(
                    (transaction) => {
                        if (transaction.categoryId) {
                            const foundCategory: ICategory | undefined =
                                categoriesById[transaction.categoryId];
                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                            if (foundCategory) {
                                return {
                                    ...transaction,
                                    categoryName: foundCategory.label,
                                };
                            }
                        }
                        return transaction;
                    },
                );

                const dlName = createStandardTransactionDlName(
                    startDate,
                    endDate,
                );

                if (dlFormat === 'csv') {
                    const converted = json2csv(withCategories);
                    downloadCsv(converted, dlName);
                } else if (dlFormat === 'txt') {
                    const converted = json2csv(withCategories);
                    downloadCsvNoSuffix(converted, `${dlName}.txt`);
                } else {
                    downloadJson(withCategories, dlName);
                }
            } catch (error) {
                dispatch(intakeError(error));
            }
        };
        getTransactions();
    };

    const handleClickReset = () => {
        setOpen(false);
    };

    if (open) {
        return (
            <Dialog
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
            >
                <DialogTitle>Export Transactions</DialogTitle>
                <DialogContent>
                    <Box sx={{ my: 2, display: 'flex', gridGap: '24px' }}>
                        <DatePicker
                            label={t('Start date')}
                            name='startDate'
                            onChange={(nextValue) => {
                                if (nextValue) {
                                    setStartDate(
                                        toBeginningMonthDayjs(nextValue),
                                    );
                                }
                            }}
                            showDaysOutsideCurrentMonth
                            slotProps={{
                                toolbar: {
                                    toolbarFormat: 'ddd DD MMMM',
                                    hidden: false,
                                },
                            }}
                            sx={{
                                borderRadius: '4px',
                            }}
                            value={startDate}
                            views={['month', 'year']}
                        />
                        <DatePicker
                            label={t('End date')}
                            name='endDate'
                            onChange={(nextValue) => {
                                if (nextValue) {
                                    const nextEndDate =
                                        toEndMonthDayjs(nextValue);
                                    if (startDate > nextEndDate) {
                                        setStartDate(
                                            toBeginningMonthDayjs(nextValue),
                                        );
                                    }
                                    setEndDate(nextEndDate);
                                }
                            }}
                            showDaysOutsideCurrentMonth
                            slotProps={{
                                toolbar: {
                                    toolbarFormat: 'ddd DD MMMM',
                                    hidden: false,
                                },
                            }}
                            sx={{
                                borderRadius: '4px',
                            }}
                            value={endDate}
                            views={['month', 'year']}
                        />
                    </Box>
                    <Typography>
                        {t('Transaction.countInView', { count: previewCount })}
                    </Typography>
                    <Select
                        onChange={(event) => {
                            setDlFormat(event.target.value);
                        }}
                        sx={{ mt: 2 }}
                        value={dlFormat}
                    >
                        <MenuItem value='csv'>CSV (Excel compatible)</MenuItem>
                        <MenuItem value='txt'>CSV as a .txt file</MenuItem>
                        <MenuItem value='json'>JSON</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickReset} size='large'>
                        {t('buttons.Cancel')}
                    </Button>
                    <Button
                        onClick={handleClickExport}
                        size='large'
                        variant='contained'
                    >
                        {t('buttons.Export')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Button
            onClick={() => {
                setOpen(true);
            }}
        >
            Export
        </Button>
    );
};

export default ExportTransactions;
