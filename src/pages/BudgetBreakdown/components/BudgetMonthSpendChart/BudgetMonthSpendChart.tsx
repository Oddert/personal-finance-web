import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Autocomplete, Box, TextField } from '@mui/material';

import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import {
    IMonthSpendCategory,
    IProps,
    ISeries,
} from './BudgetMonthSpendChart.type';
import { generateMonthSpendData } from './BudgetMonthSpendChartUtils';

dayjs.extend(localizedFormat);

/**
 * Displays each budgets raw spend value across the date range.
 *
 * "Spiritually" connected to the equivalent {@link BudgetOverview/components/BudgetMonthSpendChart} in BudgetOverview.
 * @param props.chartList The pre-calculated Budget Overview charts.
 * @param props.endDate The start date for the date range.
 * @param props.startDate The end date for the date range.
 */
const BudgetMonthSpendChart: FC<IProps> = ({ filteredTransactions }) => {
    const { t } = useTranslation();

    const [fullSeries, setSeries] = useState<ISeries[]>([]);
    const [options, setOptions] = useState<IMonthSpendCategory[]>([]);
    const [value, setValue] = useState<IMonthSpendCategory[]>([]);

    const categories = useAppSelector(getCategoryOrderedDataById);

    useEffect(() => {
        const { series: nextSeries, allCategories } = generateMonthSpendData(
            categories,
            filteredTransactions,
        );
        const nextOptions = Object.values(allCategories);
        setSeries(nextSeries);
        setOptions(nextOptions);
        setValue([nextOptions[0]]);
    }, [categories, filteredTransactions]);

    const series = useMemo(() => {
        const valuesLookup = value.reduce(
            (acc: { [id: string]: boolean }, val) => {
                if (val?.categoryId) {
                    acc[val.categoryId] = true;
                }
                return acc;
            },
            {},
        );
        return fullSeries.filter(
            (seriesItem) => seriesItem.categoryId in valuesLookup,
        );
    }, [fullSeries, value]);

    const { currencyLocaliser } = useLocalisedNumber();

    return (
        <Box>
            <Autocomplete<IMonthSpendCategory, true>
                getOptionLabel={(option) => option.categoryName}
                getOptionKey={(option) => option.categoryId}
                multiple
                options={options}
                onChange={(e, nextValue) => setValue(nextValue)}
                renderInput={(params) => (
                    <TextField {...params} label={t('Categories')} />
                )}
                value={value}
            />
            <Box
                sx={(theme) => ({
                    '& *': {
                        color: theme.palette.common.black,
                    },
                })}
            >
                <Chart
                    type='line'
                    height={500}
                    width={700}
                    options={{
                        chart: {
                            height: 500,
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
                        markers: {
                            size: 3,
                        },
                        stroke: {
                            curve: 'smooth',
                        },
                        tooltip: {
                            x: {
                                format: 'dd/MM/yy',
                            },
                            y: {
                                formatter(val) {
                                    return currencyLocaliser(val);
                                },
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
                        },
                        yaxis: {
                            tickAmount: 20,
                            labels: {
                                style: {
                                    colors: '#fff',
                                },
                                formatter(val) {
                                    return currencyLocaliser(val);
                                },
                            },
                        },
                    }}
                    series={series}
                />
            </Box>
        </Box>
    );
};

export default BudgetMonthSpendChart;
