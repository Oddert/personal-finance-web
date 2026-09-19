import type { FC } from 'react';

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

import type { IProps } from './ChartLowerOrderComponent.types';

const clipPathId = 'editscenario-preview-clippath';

const ChartLowerOrderComponent: FC<IProps> = ({ dataset, series }) => {
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

export default ChartLowerOrderComponent;
