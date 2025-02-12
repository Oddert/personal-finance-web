import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

import type { IProps, IZoomLevel } from './BudgetPercentageControls.types';

const defaultZoomLevel = 1;

/**
 * Standard set of controls designed to be paired with the Budget Percentage Chart.
 * @category Component
 * @subcategory Budget Percentage Controls
 * @component
 * @param props.setUseFloat Callback function invoked when the user toggles the float/percentage checkbox.
 * @param props.setZoomDim Callback function invoked when the zoom changes.
 * @param props.useFloat If true, raw currency values will be used. If false, percentages will be used.
 * @param props.zoomDimensionsLookup Values used when invoking setZoomDim.
 */
const BudgetPercentageControls: FC<IProps> = ({
    setUseFloat,
    setZoomDim,
    useFloat,
    zoomDimensionsLookup,
}) => {
    const { t } = useTranslation();

    const zoomLabelLookup = useMemo(
        () => [
            t('zoom.xs'),
            t('zoom.sm'),
            t('zoom.md'),
            t('zoom.lg'),
            t('zoom.xl'),
        ],
        [t],
    );

    const [zoomLevel, setZoomLevel] = useState<IZoomLevel>(defaultZoomLevel);
    const [zoomLabel, setZoomLabel] = useState(
        zoomLabelLookup[defaultZoomLevel],
    );

    const incrementZoom = () => {
        const nextZoomLevel = zoomLevel + 1;
        setZoomLevel(nextZoomLevel as IZoomLevel);
        setZoomLabel(zoomLabelLookup[nextZoomLevel]);
        setZoomDim(zoomDimensionsLookup[nextZoomLevel]);
    };

    const decrementZoom = () => {
        const nextZoomLevel = zoomLevel - 1;
        setZoomLevel(nextZoomLevel as IZoomLevel);
        setZoomLabel(zoomLabelLookup[nextZoomLevel]);
        setZoomDim(zoomDimensionsLookup[nextZoomLevel]);
    };

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
            <Typography component='label' htmlFor='zoom-control'>
                {t('Zoom level')}: {zoomLabel}
            </Typography>
            <Box id='zoom-control'>
                <IconButton
                    disabled={zoomLevel <= 0}
                    title={t('budgetPercentageControls.zoomTitles.decrease')}
                    onClick={decrementZoom}
                >
                    <ZoomMinusIcon />
                </IconButton>
                <IconButton
                    disabled={zoomLevel >= 4}
                    title={t('budgetPercentageControls.zoomTitles.increase')}
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
                label={t('budgetPercentageControls.useFloatLabel')}
                title={t('budgetPercentageControls.useFloatTitle')}
            />
        </Box>
    );
};

export default BudgetPercentageControls;
