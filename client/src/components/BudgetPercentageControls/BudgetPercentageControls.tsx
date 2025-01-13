import { FC, useState } from 'react';

import {
	Box,
	Checkbox,
	Divider,
	FormControlLabel,
	IconButton,
	Typography,
} from '@mui/material';
import {
	ZoomIn as ZoomPlusIcon,
	ZoomOut as ZoomMinusIcon,
} from '@mui/icons-material';

import { defaultZoomLevel } from '../../pages/BudgetOverview/components/PercentageCharts/PercentageCharts';

import { IProps } from './BudgetPercentageControls.types';

// Integer equivalent to 'xs', 'sm', 'md', 'lg', 'xl'
type IZoomLevel = 0 | 1 | 2 | 3 | 4
const zoomLabelLookup = ['xs', 'sm', 'md', 'lg', 'xl']

const BudgetPercentageControls: FC<IProps> = ({
	setUseFloat,
	setZoomDim,
	useFloat,
	zoomDimensionsLookup,
}) => {
	const [zoomLevel, setZoomLevel] = useState<IZoomLevel>(defaultZoomLevel);
	const [zoomLabel, setZoomLabel] = useState(zoomLabelLookup[defaultZoomLevel]);
	
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
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gridGap: '16px',
				padding: '16px 32px',
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
			<Divider orientation='vertical' flexItem />
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
	)
}

export default BudgetPercentageControls;
