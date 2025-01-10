import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import { IProps, ISeriesDatum } from './BudgetPercentageChart.types';
import { IBudgetDatum } from '../../pages/Budget/Budget.types';

const BudgetPercentageChart: FC<IProps> = ({ data, height = 350, useFloat = false, width = 350 }) => {
    const { seriesData, seriesRef } = useMemo(() => {
        const values = Object.values(data);

        return values.reduce(
			(acc: { seriesData: ISeriesDatum[], seriesRef: IBudgetDatum[] }, budgetDatum) => {
				acc.seriesData.push({
					x: budgetDatum.categoryName,
					y: useFloat ? budgetDatum.diffFloat :budgetDatum.diffPc,
					fillColor: budgetDatum.colour,
				})
				acc.seriesRef.push(budgetDatum);
				return acc
			},
			{
				seriesData: [],
				seriesRef: []
			}
		)
    }, [data, useFloat]);

    return (
        <Box sx={(theme) => ({
            '& *': {
                color: theme.palette.primary.contrastText,
            }
        })}>
            <Chart
                type='bar'
                height={height}
                width={width}
                options={{
					chart: {
						type: 'bar',
                        height: height,
                        toolbar: {
							show: false,
                        },
                    },
					legend: {
						show: false,
					},
                    plotOptions: {
                    bar: {
                        borderRadius: 4,
                        borderRadiusApplication: 'end',
                        horizontal: true,
                    }
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    grid: {
                        xaxis: {
                            lines: {
                                show: true,
                            },
                        },
                        yaxis: {
                            lines: {
                                show: true,
                            },
                        },
                    },
                    tooltip: {
                        y: {
                            title: {
                                formatter: () => '',
                            },
                            formatter: (value, opts) => {
								const budgetDatum = seriesRef[opts.dataPointIndex];
                                return `
									<p>Discrepancy (%): ${(Number(value) >= 0) ? `+${value}%` : `${value}%`}</p>
									<p>Discrepancy (£): ${budgetDatum.diffFloat < 0 ? `-£${Math.abs(budgetDatum.diffFloat)}` : `+£${budgetDatum.diffFloat}`}</p>
									<p>Expected: £${budgetDatum.budget}</p>
									<p>Actual: £${budgetDatum.spend}</p>
								`
							} 
                        },
                    },
                    xaxis: {
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: '#fff',
                            },
                        },
                    },
                }}
                series={[{
                    data: seriesData,
                }]}
            />
        </Box>
    )
}

export default BudgetPercentageChart;