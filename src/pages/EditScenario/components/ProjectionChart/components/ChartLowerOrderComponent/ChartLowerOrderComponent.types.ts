export interface IProps {
    dataset: readonly Record<string, string | number>[];
    series: readonly {
        label: string;
        dataKey: string;
        type: 'line' | 'bar';
    }[];
}
