import { type FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CloudDownload as IconDownload } from '@mui/icons-material';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { json2csv } from 'json-2-csv';

import type { IProps } from './ExportTransactions.types';
import type { ICard } from '../../types/Card.types';
import type { ICategory } from '../../types/Category';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import { getCardResponse } from '../../redux/selectors/cardSelectors';
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
    defaultCards,
    defaultEndDate,
    defaultStartDate,
    defaultUseAllCards,
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
    const [allCards, setAllCards] = useState(false);
    const [activeCards, setActiveCards] = useState<ICard[]>([]);

    const cards = useAppSelector(getCardResponse);
    const categoriesById = useAppSelector(getCategoryOrderedDataById);

    useEffect(() => {
        if (defaultUseAllCards !== undefined) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAllCards(defaultUseAllCards);
        }
        if (defaultCards !== undefined) {
            setActiveCards(defaultCards);
        }
    }, [cards, defaultCards, defaultUseAllCards]);

    useEffect(() => {
        const getCount = async () => {
            try {
                const res = await APIService.getTransactionCount(
                    startDate.valueOf(),
                    endDate.valueOf(),
                    activeCards.length
                        ? activeCards.map((card) => card.id).join(',')
                        : null,
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
    }, [activeCards, dispatch, endDate, startDate]);

    const handleClickExport = () => {
        interface IDownloadRow {
            id: string;
            currency: string | null;
            cardId: string;
            cardName: string | null;
            userId: string;
            date: string;
            transactionType: string;
            description: string;
            debit: number;
            credit: number;
            ballance: number;
            createdOn: string;
            updatedOn: string;
            categoryId: string | null;
            categoryName: string | null;
        }
        const getTransactions = async () => {
            try {
                const res = await APIService.getAllTransactionsWithinRange(
                    startDate.valueOf(),
                    endDate.valueOf(),
                    activeCards.length
                        ? activeCards.map((card) => card.id).join(',')
                        : null,
                );
                const withMixins: IDownloadRow[] = (
                    res.payload?.transactions ?? []
                ).map((transaction) => {
                    const row: IDownloadRow = {
                        id: transaction.id,
                        currency: transaction.currency,
                        cardId: transaction.cardId,
                        cardName: null,
                        userId: transaction.userId,
                        date: transaction.date,
                        transactionType: transaction.transactionType,
                        description: transaction.description,
                        debit: transaction.debit,
                        credit: transaction.credit,
                        ballance: transaction.ballance,
                        createdOn: transaction.createdOn,
                        updatedOn: transaction.updatedOn,
                        categoryId: transaction.categoryId,
                        categoryName: null,
                    };
                    if (transaction.categoryId) {
                        const foundCategory: ICategory | undefined =
                            categoriesById[transaction.categoryId];
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (foundCategory) {
                            row.categoryName = foundCategory.label;
                        }
                    }

                    const foundCard: ICard | undefined = cards.find(
                        (card) => card.id === row.cardId,
                    );
                    if (foundCard) {
                        row.cardName = foundCard.cardName;
                    }

                    return row;
                });

                const dlName = createStandardTransactionDlName(
                    startDate,
                    endDate,
                );

                if (dlFormat === 'csv') {
                    const converted = json2csv(withMixins);
                    downloadCsv(converted, dlName);
                } else if (dlFormat === 'txt') {
                    const converted = json2csv(withMixins);
                    downloadCsvNoSuffix(converted, `${dlName}.txt`);
                } else {
                    downloadJson(withMixins, dlName);
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

    // TODO: i18next
    return (
        <Fragment>
            <Button
                endIcon={<IconDownload />}
                onClick={() => {
                    setOpen(true);
                }}
            >
                Export Data
            </Button>
            <Dialog
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
            >
                <DialogTitle>Export Transactions</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: '18px' }} variant='h3'>
                        Dates
                    </Typography>
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
                            views={['year', 'month', 'day']}
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
                            views={['year', 'month', 'day']}
                        />
                    </Box>
                    <Divider />
                    <Typography sx={{ fontSize: '18px', mt: 2 }} variant='h3'>
                        Cards
                    </Typography>
                    <Box sx={{ my: 2, display: 'flex', gridGap: '24px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={allCards}
                                    onChange={(_, checked) => {
                                        setAllCards(checked);
                                    }}
                                />
                            }
                            label='All cards'
                            labelPlacement='top'
                            sx={{
                                mx: 0,
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Autocomplete
                                    disabled={allCards}
                                    fullWidth
                                    getOptionKey={(opt) => opt.id}
                                    getOptionLabel={(opt) => opt.cardName}
                                    multiple
                                    onChange={(_, value) => {
                                        setActiveCards(value);
                                    }}
                                    options={cards}
                                    renderInput={(props) => (
                                        <TextField {...props} />
                                    )}
                                    value={activeCards}
                                />
                            }
                            label={t('literals.Card')}
                            labelPlacement='top'
                            sx={(theme) => ({
                                alignItems: 'flex-start',
                                color: theme.palette.common.white,
                                mx: 0,
                                flex: 1,
                            })}
                        />
                    </Box>
                    <Divider />
                    <Typography sx={{ fontSize: '18px', mt: 2 }} variant='h3'>
                        Format
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
                <DialogActions sx={{ justifyContent: 'space-between', pl: 3 }}>
                    <Typography>
                        {t('Transaction.countInView', { count: previewCount })}
                    </Typography>
                    <Box>
                        <Button onClick={handleClickReset} size='large'>
                            {t('buttons.Cancel')}
                        </Button>
                        <Button
                            onClick={handleClickExport}
                            size='large'
                            sx={{ ml: 2 }}
                            variant='contained'
                        >
                            {t('buttons.Export')}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ExportTransactions;
