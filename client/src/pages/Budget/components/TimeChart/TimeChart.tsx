import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Box } from '@mui/material';

import { Transaction } from '../../../../types/Transaction';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import { getCategoryOrderedDataById } from '../../../../redux/selectors/categorySelectors';

import { IProps } from './TimeChart.types';

dayjs.extend(localizedFormat);

const TimeChart: FC<IProps> = ({ endDate, filteredTransactions, startDate }) => {
    const categories = useAppSelector(getCategoryOrderedDataById);
    console.log(filteredTransactions)

    // const series = useMemo(() => {
    //     const sortedByCategory = filteredTransactions.reduce(
    //         (acc: { [key: number]: { label: string, id: number, transactions: Transaction[] } }, each) => {
    //             if (each.category_id) {
    //                 if (!(each.category_id in acc)) {
    //                     const foundCategory = categories[each.category_id];
    //                     acc[each.category_id] = {
    //                         label: foundCategory?.label || `Category ID ${each.category_id}`,
    //                         id: each.category_id,
    //                         transactions: [],
    //                     }
    //                 }
    //                 acc[each.category_id].transactions.push(each);
    //             }
    //             return acc
    //         },
    //         {},
    //     )

    //     const _series = Object.values(sortedByCategory).map((seriesItem) => {
    //         const { data } = seriesItem.transactions
    //             .sort((a, b) => a.date < b.date ? -1 : 1)
    //             .reduce(
    //                 (acc: { runningTotal: number, data: { x: string, y: number }[] }, transaction) => {
    //                     if (transaction.debit > 0) {
    //                         acc.runningTotal += transaction.debit
    //                         acc.data.push({
    //                             x: new Date(transaction.date).toISOString(),
    //                             y: acc.runningTotal,
    //                         })
    //                     }
    //                     return acc
    //                 },
    //                 {
    //                     data: [],
    //                     runningTotal: 0,
    //                 },
    //             )
    //         return {
    //             name: seriesItem.label,
    //             data,
    //         }
    //     })

    //     return _series;
    // }, [categories, filteredTransactions]);

    const replacementSeries = useMemo(() => {
        const dates: number[] = []
        const endDateJs = dayjs(endDate);
        let date = dayjs(startDate);
        let ctrl = 0
        while (date.valueOf() <= endDateJs.valueOf() && ctrl < 100) {
            dates.push(date.valueOf());
            date = date.add(1, 'day');
            ctrl ++;
        }

        interface ITemp2 {
            label: string
            id: number
            transactions: {
                [key: number]: Transaction[]
            }
        }

        interface ITemp {
            [key: number]: ITemp2
        }

        const sortedByCategory = filteredTransactions.reduce(
            (acc: ITemp, each) => {
                if (each.category_id) {
                    if (!(each.category_id in acc)) {
                        const foundCategory = categories[each.category_id];
                        acc[each.category_id] = {
                            label: foundCategory?.label || `Category ID ${each.category_id}`,
                            id: each.category_id,
                            transactions: {},
                        }
                    }
                    const dateInt = dayjs(each.date).valueOf()
                    if (!(dateInt in acc[each.category_id].transactions)) {
                        acc[each.category_id].transactions[dateInt] = []
                    }
                    acc[each.category_id].transactions[dateInt].push(each)
                }
                return acc
            },
            {},
        )

        const _series = Object.values(sortedByCategory).map((seriesItem: ITemp2) => {
            const { data } = dates.reduce((accumulator: { data: { x: string, y: number }[], total: number }, date) => {
                if (date in seriesItem.transactions) {
                    accumulator.total += seriesItem.transactions[date].reduce((a, e) => a + e.debit, 0)
                }
                accumulator.data.push({
                    x: String(dayjs(date)),
                    y: accumulator.total
                })
                return accumulator
            }, { data: [], total: 0 })
            return {
                name: seriesItem.label,
                data,
            }
        })

        return _series
    }, [categories, endDate, filteredTransactions, startDate]);

    return (
        <Box sx={(theme) => ({
            '& *': {
                color: theme.palette.primary.contrastText,
            }
        })}>
            <Chart
                type='area'
                options={{
                    chart: {
                        height: 350,
                        type: 'area',
                        stacked: true,
                        // stackType: '100%',
                    },
                    dataLabels: {
                        enabled: false
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            opacityFrom: 0.6,
                            opacityTo: 0.8,
                        }
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                        min: new Date(startDate).getTime(),
                        max: new Date(endDate).getTime(),
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm'
                        },
                        y: {
                            formatter(val) {
                                return val?.toFixed(2) || '';
                            },
                        },
                        shared: true,
                    },
                    legend: {
                        labels: {
                            colors: '#fff',
                        },
                    },
                }}
                series={replacementSeries}
                // series={series}
            />
        </Box>
    )
}

export default TimeChart;
