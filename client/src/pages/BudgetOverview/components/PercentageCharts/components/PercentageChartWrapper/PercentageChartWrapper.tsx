import { FC, useRef, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Box, Typography } from '@mui/material';

import { toBeginningMonth, toEndMonth } from '../../../../../../utils/budgetUtils';

import BudgetPercentageChart from '../../../../../../components/BudgetPercentageChart';
import TransactionPreview from '../../../../../../components/TransactionPreview';

import { IProps } from './PercentageChartWrapper.types'

const defaultStart = toBeginningMonth(String(dayjs()))
const defaultEnd = toEndMonth(String(dayjs()))

dayjs.extend(localizedFormat);

const PercentageChartWrapper: FC<IProps> = ({
	monthData,
	useFloat,
	zoomDim,
}) => {
	const [categoryId, setCategoryId] = useState(-1);
	const [startDate, setStartDate] = useState(defaultStart);
	const [endDate, setEndDate] = useState(defaultEnd);
	const [open, setOpen] = useState(false);

	const ref = useRef<Element | null>(null);

	const dataPointCallback = (categoryId: number) => {
		setOpen(true);
		setCategoryId(categoryId);
		setStartDate(toBeginningMonth(String(monthData.timestamp)));
		setEndDate(toEndMonth(String(monthData.timestamp)));
	}

	return (
		<Box ref={ref} sx={{ mb: '16px' }}>
			<Typography>
				{monthData.timestamp.format('MMM YYYY')}
			</Typography>
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
					setOpen(false)
				}}
				endDate={endDate}
				open={open}
				startDate={startDate}
			/>
		</Box>
	)
}

export default PercentageChartWrapper;
