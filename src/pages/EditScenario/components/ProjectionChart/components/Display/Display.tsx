import { type FC, useMemo } from 'react';

import {
    BarPlot,
    ChartsAxis,
    ChartsAxisHighlight,
    ChartsClipPath,
    ChartsDataProvider,
    ChartsGrid,
    ChartsLegend,
    ChartsSurface,
    ChartsTooltip,
    ChartsWrapper,
    FocusedBar,
    LinePlot,
} from '@mui/x-charts';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';

import type { IProps } from './Display.types';

const clipPathId = 'editscenario-preview-clippath';

const Display: FC<IProps> = ({
    disableCategoryBreakdown,
    pastData,
    showNegatives,
}) => {
    const { dataset, series } = useMemo(() => {
        // With data pivoted on month the response format in pseudo code is: {[monthKey]: categoryData[]}
        // Here we transform this into an array where each entry represents one month, with category IDs mapped to values.
        // MUI X charts will use a series definition to resolve a label to these values.
        // The accumulator uses top-level keys is for convenient lookup until the eventual Object.values() calls.
        interface TLocalAcc {
            // Record<monthKey, Record<categoryId, value>>
            _dataset: Record<string, Record<string, string | number>>;
            // Record<categoryId, seriesItem[]>
            _series: Record<
                string,
                { label: string; dataKey: string; type: 'bar' | 'line' }
            >;
        }

        const { _dataset: datasetObj, _series: seriesObj } = pastData.reduce(
            (totalAcc: TLocalAcc, cardDataSet, idx) => {
                const { _dataset, _series } = Object.entries(
                    cardDataSet.transactions,
                ).reduce(
                    (monthAcc: TLocalAcc, [monthKey, categoryList]) => {
                        monthAcc._dataset[monthKey] = disableCategoryBreakdown
                            ? {}
                            : categoryList.data.reduce(
                                  (
                                      catAcc: Record<string, string | number>,
                                      category,
                                  ) => {
                                      const value = showNegatives
                                          ? category.totalDebit -
                                            category.totalCredit
                                          : category.totalDebit;
                                      if (!isNaN(value)) {
                                          catAcc[category.categoryId] = value;
                                      }
                                      if (
                                          !(
                                              category.categoryId in
                                              monthAcc._series
                                          )
                                      ) {
                                          monthAcc._series[
                                              category.categoryId
                                          ] = {
                                              dataKey: category.categoryId,
                                              label: category.categoryName,
                                              type: 'bar',
                                          };
                                      }
                                      return catAcc;
                                  },
                                  {},
                              );
                        monthAcc._dataset[monthKey].month = monthKey;
                        monthAcc._dataset[monthKey][
                            `total_${cardDataSet.cardId}`
                        ] = categoryList.finalBalance ?? 0;
                        monthAcc._series[`total_${cardDataSet.cardId}`] = {
                            dataKey: `total_${cardDataSet.cardId}`,
                            label: `Balance ${String(idx)}`,
                            type: 'line',
                        };
                        return monthAcc;
                    },
                    {
                        _dataset: {},
                        _series: {},
                    },
                );
                return {
                    _dataset: { ...totalAcc._dataset, ..._dataset },
                    _series: { ...totalAcc._series, ..._series },
                };
            },
            { _dataset: {}, _series: {} },
        );

        return {
            dataset: Object.values(datasetObj),
            series: Object.values(seriesObj),
        };
    }, [disableCategoryBreakdown, pastData, showNegatives]);

    console.log('dataset', dataset);
    console.log('series', series);

    return (
        <ChartsDataProvider
            dataset={dataset}
            height={600}
            // loading={loading}
            series={series}
            xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
        >
            <ChartsWrapper>
                <ChartsLegend />
                <ChartsSurface>
                    <ChartsGrid />
                    <g clipPath={`url(#${clipPathId})`}>
                        <BarPlot />
                        <LinePlot />
                        <ChartsOverlay />
                        <ChartsAxisHighlight />
                        <FocusedBar />
                    </g>
                    <ChartsAxis />
                    <ChartsClipPath id={clipPathId} />
                </ChartsSurface>
                <ChartsTooltip />
            </ChartsWrapper>
        </ChartsDataProvider>
    );
};

export default Display;
