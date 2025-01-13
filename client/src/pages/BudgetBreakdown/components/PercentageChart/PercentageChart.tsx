import { FC, useRef, useState } from 'react';

import { Box } from '@mui/material';

import BudgetPercentageChart from '../../../../components/BudgetPercentageChart';
import TransactionPreview from '../../../../components/TransactionPreview';

import { IProps } from './PercentageChart.types';

const PercentageChart: FC<IProps> = ({ data, endDate, startDate }) => {
	const [categoryId, setCategoryId] = useState(-1);
	const [open, setOpen] = useState(false);

	const ref = useRef<Element | null>(null);

	const dataPointCallback = (categoryId: number) => {
		setOpen(true);
		setCategoryId(categoryId);
	}

	return (
		<Box ref={ref}>
			<BudgetPercentageChart
				data={data}
				dataPointCallback={dataPointCallback}
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
}

export default PercentageChart;
