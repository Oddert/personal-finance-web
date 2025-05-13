import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
    Accordion,
    AccordionActions,
    AccordionSummary,
    Box,
    FormControlLabel,
    Paper,
    Typography,
} from '@mui/material';
import { ExpandMore as IconExpand } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import type { ITransaction } from '../../types/Transaction.d';

import useTransactions from '../../hooks/useTransactions';
import { useAppSelector } from '../../hooks/ReduxHookWrappers';

import { getActiveLanguageCode } from '../../redux/selectors/profileSelectors';

import {
    chart1BaseOptions,
    chart2BaseOptions,
    defaultEnd,
    defaultStart,
} from './ExistingDataLineChartUtils';

dayjs.extend(localizedFormat);

interface Props {
    compact?: boolean;
}

/**
 * Module to display all existing data.
 * @category Modules
 * @subcategory Existing Data Chart
 * @component
 * @param props.compact If true, displays as a card module for composition with other modules.
 */
const ExistingDataLineChart: FC<Props> = ({ compact = false }) => {
    const { t } = useTranslation();

    const [ballanceData, setBallanceData] = useState<
        { x: number | string; y: number }[]
    >([]);
    const [debitData, setDebitData] = useState<
        { x: number | string; y: number }[]
    >([]);
    const [debitTransactions, setDebitTransactions] = useState<ITransaction[]>(
        [],
    );
    const [creditData, setCreditData] = useState<
        { x: number | string; y: number }[]
    >([]);
    const [debitMax, setDebitMax] = useState<number>(0);
    const [startDate, setStartDate] = useState<Dayjs>(dayjs(defaultStart));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs(defaultEnd));

    // Workaround for issue owners seem unwilling / unable to resolve:
    // https://github.com/apexcharts/react-apexcharts/issues/182
    // https://github.com/apexcharts/react-apexcharts/issues/31
    const [chart1Options, setChart1Options] = useState<ApexOptions>({});
    const [chart2Options, setChart2Options] = useState<ApexOptions>({});

    const { transactions } = useTransactions(startDate, endDate);
    const language = useAppSelector(getActiveLanguageCode);

    useEffect(() => {
        const sorted = transactions.reduce(
            (
                acc: {
                    ballance: { x: number | string; y: number }[];
                    debit: { x: number | string; y: number }[];
                    credit: { x: number | string; y: number }[];
                    debitMax: number;
                    debitTransactions: ITransaction[];
                },
                transaction,
            ) => {
                acc.ballance.push({
                    x: transaction.date,
                    y: transaction.ballance,
                });
                if (transaction.debit) {
                    acc.debit.push({
                        x: transaction.date,
                        y: transaction.debit,
                    });
                    if (transaction.debit > acc.debitMax) {
                        acc.debitMax = transaction.debit;
                    }
                    acc.debitTransactions.push(transaction);
                }
                if (transaction.credit) {
                    acc.credit.push({
                        x: transaction.date,
                        y: transaction.credit,
                    });
                }
                return acc;
            },
            {
                ballance: [],
                debit: [],
                credit: [],
                debitMax: 0,
                debitTransactions: [],
            },
        );
        setDebitMax(sorted.debitMax);
        setDebitTransactions(sorted.debitTransactions);
        setBallanceData(sorted.ballance);
        setDebitData(sorted.debit);
        setCreditData(sorted.credit);
    }, [endDate, startDate, transactions]);

    useEffect(() => {
        setChart1Options(chart1BaseOptions(language));
        const chart2Default = chart2BaseOptions(language);
        setChart2Options({
            ...chart2Default,
            tooltip: {
                ...chart2Default.tooltip,
                y: {
                    formatter: (val, opts) =>
                        `${debitTransactions[opts.dataPointIndex].description} : ${val}`,
                },
            },
            yaxis: {
                ...chart2Default.yaxis,
                max: debitMax,
            },
        });
    }, [debitTransactions, debitMax, language]);

    const width = useMemo(() => (compact ? '100%' : '80%'), [compact]);

    const Controls = (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
            }}
        >
            <FormControlLabel
                control={
                    <DatePicker
                        name='startDate'
                        onChange={(nextValue) => {
                            if (nextValue) {
                                setStartDate(nextValue);
                            }
                        }}
                        showDaysOutsideCurrentMonth
                        slotProps={{
                            toolbar: {
                                toolbarFormat: 'ddd MMMM YYYY',
                                hidden: false,
                            },
                        }}
                        sx={{
                            borderRadius: '4px',
                        }}
                        value={startDate}
                    />
                }
                label={t('Start date')}
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,
                })}
            />
            <FormControlLabel
                control={
                    <DatePicker
                        name='endDate'
                        onChange={(nextValue) => {
                            if (nextValue) {
                                setEndDate(nextValue);
                            }
                        }}
                        showDaysOutsideCurrentMonth
                        slotProps={{
                            toolbar: {
                                toolbarFormat: 'ddd MMMM YYYY',
                                hidden: false,
                            },
                        }}
                        sx={{
                            borderRadius: '4px',
                        }}
                        value={endDate}
                    />
                }
                label={t('End date')}
                labelPlacement='top'
                sx={(theme) => ({
                    alignItems: 'flex-start',
                    color: theme.palette.common.white,
                })}
            />
        </Box>
    );

    return (
        <Paper
            elevation={4}
            sx={(theme) => ({
                margin: '20px 0 0',
                padding: '20px',
                '& #apexchartsexisting-data-line-chart, & #apexchartscredit-debit-chart':
                    {
                        margin: '0 auto',
                    },
                color: theme.palette.common.black,
            })}
        >
            {compact ? (
                <Accordion>
                    <AccordionSummary
                        aria-controls='projection-line-controls'
                        expandIcon={<IconExpand />}
                        id='projection-controls-header'
                    >
                        {t('Past Data')}
                    </AccordionSummary>
                    <AccordionActions>{Controls}</AccordionActions>
                </Accordion>
            ) : (
                <Box sx={{ width: '80%', margin: '0 auto' }}>
                    <Typography
                        sx={(theme) => ({
                            color: theme.palette.common.white,
                            width,
                            margin: '16px auto 32px',
                        })}
                        variant='h3'
                    >
                        {t('Past Data')}
                    </Typography>
                    {Controls}
                </Box>
            )}
            <Box
                sx={{
                    '& .apexcharts-canvas': { margin: '0 auto' },
                }}
            >
                <Chart
                    options={chart1Options}
                    series={[
                        {
                            name: 'Ballance',
                            data: ballanceData,
                        },
                        // {
                        //     name: 'Out',
                        //     type: 'bar',
                        //     data: debitData,
                        // },
                        // {
                        //     name: 'Out',
                        //     type: 'bar',
                        //     data: creditData,
                        // }
                        // {
                        //     name: 'Ballance',
                        //     data: [
                        //         { x: 'cat 1', y: 5 },
                        //         { x: 'cat 2', y: 2 },
                        //         { x: 'cat 3', y: 8 },
                        //         { x: 'cat 4', y: 4 },
                        //         { x: 'cat 5', y: 9 },
                        //         { x: 'cat 6', y: 1 },
                        //     ],
                        // }
                    ]}
                    type='line'
                    width={width}
                    height='400px'
                />
            </Box>
            <Box sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        '& .apexcharts-canvas': { margin: '0 auto' },
                    }}
                >
                    <Chart
                        options={chart2Options}
                        series={[
                            {
                                name: t('Debit'),
                                data: debitData,
                            },
                            {
                                name: t('Credit'),
                                data: creditData,
                            },
                        ]}
                        type='bar'
                        width={width}
                        height='200px'
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default ExistingDataLineChart;
