import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { Box } from '@mui/material';

import { IProps, ISeriesDatum } from './BudgetPercentageChart.types';

const BudgetPercentageChart: FC<IProps> = ({ data, height = 350, width = 350 }) => {
    const { seriesData } = useMemo(() => {
        const values = Object.values(data);

        return values.reduce(
			(acc: { seriesData: ISeriesDatum[] }, budgetDatum) => {
				acc.seriesData.push({
					x: budgetDatum.categoryName,
					y: budgetDatum.diffPc,
					fillColor: budgetDatum.colour,
				})
				return acc
			},
			{
				seriesData: [],
			}
		)
    }, [data]);

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
                            formatter: (value) => 
                                (Number(value) >= 0) ? `+${value}%` : `${value}%`,
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