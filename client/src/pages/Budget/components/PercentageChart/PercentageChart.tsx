import { FC, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { IProps } from './PercentageChart.types';

const PercentageChart: FC<IProps> = ({ data }) => {
    const { categories, seriesData } = useMemo(() => {
        const values = Object.values(data);
        return values.reduce((a: { categories: string[], seriesData: number[] }, e) => {
            a.categories.push(e.categoryName)
            a.seriesData.push(e.diffPc)
            return a
        },
        {
            categories: [],
            seriesData: [],
        })
    }, [data]);

    return (
        <Chart
            type='bar'
            height={350}
            options={{
                chart: {
                  type: 'bar',
                  height: 350,
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
                xaxis: {
                  categories,
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
    )
}

export default PercentageChart;