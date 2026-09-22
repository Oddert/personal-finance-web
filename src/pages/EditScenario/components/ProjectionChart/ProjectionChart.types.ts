import type {
    IProjectionChartProps,
    TPreviewMode,
} from '../../EditScenario.types';

export interface IProps extends IProjectionChartProps {
    /** Whether to show the full aggregations, just the balance columns, or disable the chart. */
    previewMode: TPreviewMode;
    /** If true, a separate chart will be rendered per-card, otherwise the result is aggregated. */
    splitOnCards?: boolean;
}
