import { FC, useState } from 'react';

import { Box, IconButton, Paper, Typography } from '@mui/material';
import {
	ZoomIn as ZoomPlusIcon,
	ZoomOut as ZoomMinusIcon,
} from '@mui/icons-material';

import BudgetPercentageChart from '../../../../components/BudgetPercentageChart';

import { IProps } from './PercentageCharts.types';

// Integer equivilent to 'xs', 'sm', 'md', 'lg', 'xl'
type IZoomLevel = 0 | 1 | 2 | 3 | 4

const defaultZoomLevel = 1
const zoomLabelLookup = ['xs', 'sm', 'md', 'lg', 'xl']
const zoomDimensionsLookup = [
	{ height: 250, width: 250 },
	{ height: 300, width: 300 },
	{ height: 350, width: 350 },
	{ height: 400, width: 400 },
	{ height: 500, width: 500 },
]

const PercentageCharts: FC<IProps> = ({ chartList }) => {
	const [zoomLevel, setZoomLevel] = useState<IZoomLevel>(defaultZoomLevel);
	const [zoomLabel, setZoomLabel] = useState(zoomLabelLookup[defaultZoomLevel]);
	const [zoomDim, setZoomDim] = useState<{ height: number, width: number }>(
		zoomDimensionsLookup[defaultZoomLevel],
	);

	const incrementZoom = () => {
		const nextZoomLevel = zoomLevel + 1
		setZoomLevel(nextZoomLevel as IZoomLevel);
		setZoomLabel(zoomLabelLookup[nextZoomLevel]);
		setZoomDim(zoomDimensionsLookup[nextZoomLevel]);
	}

	const decrementZoom = () => {
		const nextZoomLevel = zoomLevel - 1
		setZoomLevel(nextZoomLevel as IZoomLevel);
		setZoomLabel(zoomLabelLookup[nextZoomLevel]);
		setZoomDim(zoomDimensionsLookup[nextZoomLevel]);
	}

	return (
		<Paper elevation={0}>
			<Typography>Zoom level: {zoomLabel}</Typography>
			<IconButton
				disabled={zoomLevel <= 0}
				onClick={decrementZoom}
			>
				<ZoomMinusIcon />
			</IconButton>
			<IconButton
				disabled={zoomLevel >= 4}
				onClick={incrementZoom}
			>
				<ZoomPlusIcon />
			</IconButton>
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
					<Box key={idx}>
						<BudgetPercentageChart
							data={monthData.data}
							height={zoomDim.height}
							width={zoomDim.width}
						/>
						<Typography>{monthData.timestamp.format('MMM YYYY')}</Typography>
					</Box>
				))}
			</Box>
		</Paper>
	)
}

export default PercentageCharts;
