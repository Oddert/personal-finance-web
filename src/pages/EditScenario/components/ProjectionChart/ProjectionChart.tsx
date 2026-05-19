import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import { TAggregateDatapoints } from '../../../../types/Transaction.d';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../../../redux/selectors/cardSelectors';
import { intakeError } from '../../../../redux/thunks/errorThunks';

import APIService from '../../../../services/APIService';

import { IProps } from './ProjectionChart.types';
import { Button, CircularProgress, Paper, useTheme } from '@mui/material';
import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';
import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

const ProjectionChart: FC<IProps> = () => {
    const [pastData, setPastData] = useState<TAggregateDatapoints>({});
    const [pastDataLoading, setPastDataLoading] = useState(false);

    const cardId = useAppSelector(getActiveCardId);

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const language = useAppSelector(getActiveLanguageCode);
    const categoryLookup = useAppSelector(getCategoryOrderedDataById);
    const theme = useTheme();

    useEffect(() => {
        if (cardId?.length) {
            try {
                setPastDataLoading(true);
                const fetchPastData = async () => {
                    const pastDataResponse =
                        await APIService.getAllTransactionsAggregated(
                            cardId ?? '',
                            true,
                        );
                    if (!pastDataResponse || !pastDataResponse.payload) {
                        throw new Error(t('modalMessages.noServerResponse'));
                    }
                    setPastData(pastDataResponse.payload.transactions);
                    setPastDataLoading(false);
                };
                fetchPastData();
            } catch (error: any) {
                dispatch(intakeError(error));
                setPastDataLoading(false);
            }
        }
    }, [t, cardId]);

    const data = useMemo(
        () => [
            ...Object.entries(pastData).map(([categoryId, series]) => ({
                name:
                    categoryId in categoryLookup
                        ? categoryLookup[categoryId].label
                        : categoryId,
                data: series.map((datum) => ({
                    x: datum.month,
                    y: datum.totalDebit - datum.totalCredit,
                })),
            })),
        ],
        [categoryLookup, pastData],
    );

    console.log(pastData, data);

    const handleClickHideAll = () => {
        const chart = ApexCharts.getChartByID('existing-data-bar-chart');
        console.log(chart);
        if (chart) {
            Object.values(categoryLookup).forEach((category) =>
                chart.hideSeries(category.label),
            );
        }
    };

    const handleClickShowAll = () => {
        const chart = ApexCharts.getChartByID('existing-data-bar-chart');
        if (chart) {
            Object.values(categoryLookup).forEach((category) =>
                chart.showSeries(category.label),
            );
        }
    };

    if (pastDataLoading) {
        return <CircularProgress />;
    }

    return (
        <Paper
            sx={{
                color: theme.palette.common.black,
                margin: '20px 0 0',
                padding: '20px',
                '& #apexchartsexisting-data-bar-chart, & #apexchartscredit-debit-chart':
                    {
                        margin: '0 auto',
                    },
            }}
        >
            <Chart
                height='600px'
                options={{
                    chart: {
                        id: 'existing-data-bar-chart',
                        type: 'bar',
                        stacked: true,
                        animations: {
                            enabled: false,
                            speed: 1,
                        },
                    },
                    grid: {
                        show: true,
                        row: {
                            colors: ['rgba(243, 243, 243, 0.3)', 'transparent'],
                        },
                    },
                    legend: {
                        show: true,
                        labels: {
                            colors: theme.palette.common.white,
                        },
                    },
                    markers: {
                        size: 2,
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2,
                    },
                    tooltip: {
                        shared: true,
                        intersect: false,
                    },
                    xaxis: {
                        labels: {
                            style: {
                                colors: theme.palette.common.white,
                            },
                            formatter: (val: string) =>
                                new Date(val).toLocaleDateString(language),
                        },
                        tickAmount: 10,
                    },
                    yaxis: {
                        // logarithmic: true,
                        tickAmount: 12,
                        labels: {
                            style: {
                                colors: theme.palette.common.white,
                            },
                            formatter: (val) => String(Math.round(Number(val))),
                            // formatter: largeValueFormatter,
                        },
                    },
                }}
                series={data}
                type='bar'
                width={'80%'}
            />
            <Button onClick={handleClickHideAll}>Hide all</Button>
            <Button onClick={handleClickShowAll}>Show all</Button>
        </Paper>
    );
};

export default ProjectionChart;
