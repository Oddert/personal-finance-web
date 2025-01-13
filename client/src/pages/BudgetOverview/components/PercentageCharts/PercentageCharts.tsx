import { FC, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
	Box,
	Checkbox,
	FormControlLabel,
	IconButton,
	Paper,
	Typography,
} from '@mui/material';
import {
	ZoomIn as ZoomPlusIcon,
	ZoomOut as ZoomMinusIcon,
} from '@mui/icons-material';

import { IProps } from './PercentageCharts.types';
import PercentageChartWrapper from './components/PercentageChartWrapper';

// Integer equivalent to 'xs', 'sm', 'md', 'lg', 'xl'
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

dayjs.extend(localizedFormat);

const PercentageCharts: FC<IProps> = ({ chartList }) => {
	const [zoomLevel, setZoomLevel] = useState<IZoomLevel>(defaultZoomLevel);
	const [zoomLabel, setZoomLabel] = useState(zoomLabelLookup[defaultZoomLevel]);
	const [zoomDim, setZoomDim] = useState<{ height: number, width: number }>(
		zoomDimensionsLookup[defaultZoomLevel],
	);
	const [useFloat, setUseFloat] = useState(false);

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
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Typography component='label' htmlFor='zoom-control'>Zoom level: {zoomLabel}</Typography>
				<Box id='zoom-control'>
					<IconButton
						disabled={zoomLevel <= 0}
						title='decrease chart size'
						onClick={decrementZoom}
						>
						<ZoomMinusIcon />
					</IconButton>
					<IconButton
						disabled={zoomLevel >= 4}
						title='increase chart size'
						onClick={incrementZoom}
					>
						<ZoomPlusIcon />
					</IconButton>
				</Box>
				<FormControlLabel
					control={
						<Checkbox
							checked={useFloat}
							onClick={() => setUseFloat(!useFloat)}
						/>
					}
					label='Raw currency value'
					title='By default, the percentage breakdown charts show percentage discrepancies. Check to switch to raw currency value.'
				/>
			</Box>
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
	)
}

export default PercentageCharts;
