import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
// import useContentWidth from '../../../../hooks/useContentWidth';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

import type { IProps } from './TimeChart.types';
import { generateTimeChartSeries } from './TimeChartUtils';

const breakdownTimeChart = 'breakdown-time-chart';

dayjs.extend(localizedFormat);

/**
 * Area chart showing how each category's spend aggregates across the time period.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const TimeChart: FC<IProps> = ({
    endDate,
    filteredTransactions,
    startDate,
}) => {
    const { t } = useTranslation();

    const [includeCredit, setIncludeCredit] = useState(false);

    const categories = useAppSelector(getCategoryOrderedDataById);

    // const { contentWidth } = useContentWidth();
    const { currencyLocaliser } = useLocalisedNumber();

    const series = useMemo(
        () =>
            generateTimeChartSeries(
                categories,
                endDate,
                filteredTransactions,
                includeCredit,
                startDate,
            ),
        [categories, endDate, filteredTransactions, includeCredit, startDate],
    );

    const handleClickToggle = () => {
        series.forEach((value) =>
            ApexCharts.exec(breakdownTimeChart, 'toggleSeries', value.name),
        );
    };

    return (
        <Box>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={includeCredit}
                        onChange={(event) =>
                            setIncludeCredit(event.target.checked)
                        }
                    />
                }
                label={t('Budget.includeCreditLabel')}
                title={t('Budget.includeCreditTitle')}
            />
            <Box
                sx={(theme) => ({
                    '& *': {
                        color: theme.palette.common.black,
                    },
                })}
            >
                <Chart
                    type='area'
                    // width={contentWidth}
                    height={500}
                    width={1000}
                    options={{
                        chart: {
                            id: breakdownTimeChart,
                            height: 350,
                            type: 'area',
                            stacked: true,
                            zoom: {
                                enabled: true,
                                allowMouseWheelZoom: false,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                opacityFrom: 0.6,
                                opacityTo: 0.8,
                            },
                        },
                        legend: {
                            labels: {
                                colors: '#fff',
                            },
                        },
                        stroke: {
                            curve: 'straight',
                        },
                        tooltip: {
                            x: {
                                format: 'dd/MM/yy',
                            },
                            y: {
                                formatter: (val) => currencyLocaliser(val),
                            },
                            shared: true,
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                style: {
                                    colors: '#fff',
                                },
                            },
                            min: new Date(String(startDate)).getTime(),
                            max: new Date(String(endDate)).getTime(),
                        },
                        yaxis: {
                            tickAmount: 14,
                            labels: {
                                formatter: (val) => currencyLocaliser(val),
                                style: {
                                    colors: '#fff',
                                },
                            },
                        },
                    }}
                    series={series}
                />
            </Box>
            <Button onClick={handleClickToggle} variant='contained'>
                {t('buttons.toggleAllCategories')}
            </Button>
        </Box>
    );
};

export default TimeChart;
