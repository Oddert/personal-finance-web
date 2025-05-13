import { FC, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Typography } from '@mui/material';

import {
    toBeginningMonthDayjs,
    toEndMonthDayjs,
} from '../../../../../../utils/budgetUtils';

import BudgetPercentageChart from '../../../../../../components/BudgetPercentageChart';
import TransactionPreview from '../../../../../../components/TransactionPreview';

import type { IProps } from './PercentageChartWrapper.types';

const defaultStart = toBeginningMonthDayjs(String(dayjs()));
const defaultEnd = toEndMonthDayjs(String(dayjs()));

dayjs.extend(localizedFormat);

/**
 * Wrapper for {@link BudgetPercentageChart}.
 *
 * Adds a title and {@link TransactionPreview} to quickly view contained transactions.
 * @category Pages
 * @subcategory Budget Overview
 * @component
 */
const PercentageChartWrapper: FC<IProps> = ({
    monthData,
    useFloat,
    zoomDim,
}) => {
    const [categoryId, setCategoryId] = useState('-1');
    const [startDate, setStartDate] = useState<Dayjs>(defaultStart);
    const [endDate, setEndDate] = useState<Dayjs>(defaultEnd);
    const [open, setOpen] = useState(false);

    const ref = useRef<Element | null>(null);

    const dataPointCallback = (nextCategoryId: string) => {
        setOpen(true);
        setCategoryId(nextCategoryId);
        setStartDate(toBeginningMonthDayjs(monthData.timestamp));
        setEndDate(toEndMonthDayjs(monthData.timestamp));
    };

    return (
        <Box ref={ref} sx={{ mb: '16px' }}>
            <Typography>{monthData.timestamp.format('MMM YYYY')}</Typography>
            <BudgetPercentageChart
                data={monthData.data}
                dataPointCallback={dataPointCallback}
                height={zoomDim.height}
                useFloat={useFloat}
                width={zoomDim.width}
            />
            <TransactionPreview
                anchorEl={ref.current}
                categoryId={categoryId}
                clearAnchorEl={() => {
                    setOpen(false);
                }}
                endDate={endDate}
                open={open}
                startDate={startDate}
            />
        </Box>
    );
};

export default PercentageChartWrapper;
