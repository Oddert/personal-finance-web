import { type FC, useMemo } from 'react';

import { BarChart } from '@mui/x-charts';

import type { IProps } from './Display.types';

const Display: FC<IProps> = ({ loading, pastData, showNegatives }) => {
    const { dataset, series } = useMemo(() => {
        // With data pivoted on month the response format in pseudo code is: {[monthKey]: categoryData[]}
        // Here we transform this into an array where each entry represents one month, with category IDs mapped to values.
        // MUI X charts will use a series definition to resolve a label to these values.
        // The accumulator uses top-level keys is for convenient lookup until the eventual Object.values() calls.
        interface TLocalAcc {
            // Record<monthKey, Record<categoryId, value>>
            _dataset: Record<string, Record<string, string | number>>;
            // Record<categoryId, seriesItem[]>
            _series: Record<string, { label: string; dataKey: string }>;
        }

        const { _dataset, _series } = Object.entries(pastData).reduce(
            (monthAcc: TLocalAcc, [monthKey, categoryList]) => {
                monthAcc._dataset[monthKey] = categoryList.data.reduce(
                    (catAcc: Record<string, string | number>, category) => {
                        const value = showNegatives
                            ? category.totalDebit - category.totalCredit
                            : category.totalDebit;
                        if (!isNaN(value)) {
                            catAcc[category.categoryId] = value;
                        }
                        if (!(category.categoryId in monthAcc._series)) {
                            monthAcc._series[category.categoryId] = {
                                dataKey: category.categoryId,
                                label: category.categoryName,
                            };
                        }
                        return catAcc;
                    },
                    {},
                );
                monthAcc._dataset[monthKey].month = monthKey;
                return monthAcc;
            },
            { _dataset: {}, _series: {} },
        );

        return {
            dataset: Object.values(_dataset),
            series: Object.values(_series),
        };
    }, [pastData, showNegatives]);

    return (
        <BarChart
            dataset={dataset}
            height={600}
            loading={loading}
            series={series}
            xAxis={[{ dataKey: 'month' }]}
        />
    );
};

export default Display;
