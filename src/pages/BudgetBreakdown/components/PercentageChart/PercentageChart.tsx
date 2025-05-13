import { FC, useRef, useState } from 'react';

import { Box } from '@mui/material';

import BudgetPercentageChart from '../../../../components/BudgetPercentageChart';
import BudgetPercentageControls from '../../../../components/BudgetPercentageControls';
import TransactionPreview from '../../../../components/TransactionPreview';

import type { IProps } from './PercentageChart.types';

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

/**
 * Wrapper for the {@link BudgetPercentageChart} adding in {@link TransactionPreview} and a custom title.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const PercentageChart: FC<IProps> = ({ data, endDate, startDate }) => {
    const [categoryId, setCategoryId] = useState('-1');
    const [open, setOpen] = useState(false);
    const [useFloat, setUseFloat] = useState(false);
    const [zoomDim, setZoomDim] = useState<{ height: number; width: number }>(
        zoomDimensionsLookup[defaultZoomLevel],
    );

    const ref = useRef<Element | null>(null);

    const dataPointCallback = (nextCategoryId: string) => {
        setOpen(true);
        setCategoryId(nextCategoryId);
    };

    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <BudgetPercentageControls
                setUseFloat={setUseFloat}
                setZoomDim={setZoomDim}
                useFloat={useFloat}
                zoomDimensionsLookup={zoomDimensionsLookup}
            />
            <BudgetPercentageChart
                data={data}
                dataPointCallback={dataPointCallback}
                height={zoomDim.height}
                useFloat={useFloat}
                width={zoomDim.width}
            />
            <TransactionPreview
                anchorEl={ref.current}
                categoryId={categoryId}
                clearAnchorEl={() => setOpen(false)}
                endDate={endDate}
                open={open}
                startDate={startDate}
            />
        </Box>
    );
};

export default PercentageChart;
