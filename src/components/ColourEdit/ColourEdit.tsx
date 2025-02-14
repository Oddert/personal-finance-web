import { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorChangeHandler, SketchPicker } from 'react-color';

import { Box, Button, Popover } from '@mui/material';

import { defaultCategoryColours } from '../../constants/categoryConstants';

import ColourBase from '../ColourBase';

import type { IProps } from './ColourEdit.types';

/**
 * Displays a Colour square with the ability to edit the colour by clicking an edit button.
 * @category Components
 * @subcategory Colour Edit
 * @component
 * @param props.colour The colour to display.
 * @param props.onSubmit Callback function invoked when a colour change is committed.
 * @param props.popoverId HTML ID attribute applied to the internal Popover.
 * @param props.sx Style overrides applied to the overall container.
 */
const ColourEdit: FC<IProps> = ({ colour, onSubmit, popoverId, sx }) => {
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [editedColour, setEditedColour] = useState<string>('#bec3c7');
    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const [originalColour, setOriginalColour] = useState<string>('#bec3c7');

    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setHasChanged(false);
        setEditedColour(originalColour);
    }, [originalColour]);

    const handleChange: ColorChangeHandler = useCallback(
        (change) => {
            setEditedColour(change.hex);
            if (!hasChanged) {
                setHasChanged(true);
            }
        },
        [hasChanged],
    );

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubmit = useCallback(() => {
        setAnchorEl(null);
        onSubmit(editedColour);
    }, [editedColour, onSubmit]);

    useEffect(() => {
        if (colour) {
            setEditedColour(colour);
            setOriginalColour(colour);
        }
    }, [colour]);

    const open = Boolean(anchorEl);
    const id = open
        ? popoverId
            ? popoverId
            : 'choose-category-colour'
        : undefined;

    return (
        <Box
            className='Category_Colour'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...sx,
            }}
        >
            <ColourBase
                asButton
                colour={editedColour}
                handleClick={handleClick}
                id={id}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                sx={{
                    zIndex: 1400,
                }}
            >
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        background: theme.palette.common.white,
                        borderRadius: '4px',
                        '& .sketch-picker': {
                            boxShadow: 'none !important',
                        },
                    })}
                >
                    <SketchPicker
                        color={editedColour}
                        onChange={handleChange}
                        presetColors={defaultCategoryColours}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            color='info'
                            onClick={handleClose}
                            size='small'
                            sx={{
                                margin: '4px 0px',
                            }}
                            variant='text'
                        >
                            {t('buttons.Cancel')}
                        </Button>
                        <Button
                            color='info'
                            disabled={!hasChanged}
                            onClick={handleSubmit}
                            size='small'
                            sx={{
                                margin: '4px 8px',
                                '&:disabled': {
                                    backgroundColor: 'transparent',
                                    color: 'rgba(34, 34, 34, 0.3)',
                                },
                            }}
                            variant='contained'
                        >
                            {t('buttons.Save')}
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};

export default ColourEdit;
