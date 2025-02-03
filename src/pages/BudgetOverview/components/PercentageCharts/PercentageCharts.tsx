import { FC, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Paper } from '@mui/material';

import BudgetPercentageControls from '../../../../components/BudgetPercentageControls/';

import type { IProps } from './PercentageCharts.types';
import PercentageChartWrapper from './components/PercentageChartWrapper';

const defaultZoomLevel = 1;
const zoomDimensionsLookup: [
    { height: number; width: number },
    { height: number; width: number },
    { height: number; width: number },
    { height: number; width: number },
    { height: number; width: number },
] = [
    { height: 250, width: 250 },
    { height: 300, width: 300 },
    { height: 350, width: 350 },
    { height: 400, width: 400 },
    { height: 500, width: 500 },
];

dayjs.extend(localizedFormat);

/**
 * Displays a series of Budget Percentage Charts for the selected date range.
 * @category Pages
 * @subcategory Budget Overview
 * @component
 * @param props.chartList The list of pre-formatted Percentage Chart objects.
 */
const PercentageCharts: FC<IProps> = ({ chartList }) => {
    const [zoomDim, setZoomDim] = useState<{ height: number; width: number }>(
        zoomDimensionsLookup[defaultZoomLevel],
    );
    const [useFloat, setUseFloat] = useState(false);

    return (
        <Paper elevation={0}>
            <BudgetPercentageControls
                setUseFloat={setUseFloat}
                setZoomDim={setZoomDim}
                useFloat={useFloat}
                zoomDimensionsLookup={zoomDimensionsLookup}
            />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    padding: '16px',
                }}
            >
                {chartList.map((monthData, idx) => (
                    <PercentageChartWrapper
                        key={idx}
                        monthData={monthData}
                        useFloat={useFloat}
                        zoomDim={zoomDim}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default PercentageCharts;
