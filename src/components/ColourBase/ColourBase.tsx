import { FC } from 'react';
import { Box, Button, Theme } from '@mui/material';
import { Edit as IconEdit } from '@mui/icons-material';

import { categoryBoxSizes } from '../../constants/categoryConstants';

import type { IProps } from './ColourBase.types';

/**
 * Lower order component used to allow non-interactive rendering of the colour square.
 * @category Components
 * @subcategory Colour Base
 * @component
 * @example
 *  return (
 *      <ColourBase
 *          asButton={false}
 *          colour='#ecf0f1'
 *      />
 *  )
 * @param props.asButton If true, the component will render as a button with `handleClick` enabled.
 * @param props.colour The colour to be displayed.
 * @param props.handleClick Callback function invoked when the button is clicked (if `asButton` is also `true`).
 * @param props.id HTML id attribute to be assigned to the button.
 * @param props.size The size of the icon (default: 'md').
 */
const ColourBase: FC<IProps> = ({
    asButton = true,
    colour = '',
    handleClick = () => {},
    id = '',
    size = 'md',
}) => {
    const sx = (theme: Theme) => ({
        width: categoryBoxSizes[size],
        height: categoryBoxSizes[size],
        minWidth: categoryBoxSizes[size],
        minHeight: categoryBoxSizes[size],
        color: theme.palette.common.white,
        cursor: 'pointer',
        padding: 0,
        backgroundColor: colour,
        borderRadius: '4px',
        transition: '.1s linear',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .Category_Colour__icon': {
            transition: '.1s linear',
            opacity: 0,
        },
        '&:hover': {
            filter: 'brightness(85%)',
            background: colour,
            '& .Category_Colour__icon': {
                opacity: 1,
            },
        },
    });

    if (asButton) {
        return (
            <Button aria-describedby={id} onClick={handleClick} sx={sx}>
                <IconEdit className='Category_Colour__icon' />
            </Button>
        );
    }
    return <Box aria-describedby={id} sx={sx} />;
};

export default ColourBase;
