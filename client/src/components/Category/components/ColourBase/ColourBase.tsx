import { MouseEvent } from 'react'
import { Box, Button, Theme } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'

import { categoryBoxSizes } from '../../../../constants/categoryConstants'

interface Props {
    asButton: boolean
    colour: string
    handleClick?: (event: MouseEvent<HTMLButtonElement>) => void
    id?: string
    size: 'xs'|'sm'|'md'|'lg'|'xl'
}

/**
 * Lower order component used to allow non-interactive rendering of the colour square.
 * @category Components
 * @subcategory Category
 * @component
 * @example
 *  return (
 *      <ColourBase
 *          colour='#ecf0f1'
 *      />
 *  )
 * @param props.asButton If true, the component will render as a button with handleClick enabled.
 * @param props.colour The colour to be displayed.
 * @param props.handleClick Callback function to be called onClick.
 * @param props.id HTML id attribute to be assigned to the button.
 * @param props.size The size of the icon (default: 'md').
 */
const ColourBase = ({ asButton, colour, handleClick, id, size }: Props) => {
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
    })

    if (asButton) {
        return (
            <Button
                aria-describedby={id}
                onClick={handleClick}
                sx={sx}
            >
                <EditIcon className='Category_Colour__icon' />
            </Button>
        )
    }
    return (
        <Box
            aria-describedby={id}
            sx={sx}
        />
    )
}

ColourBase.defaultProps = {
    asButton: true,
    colour: '',
    handleClick: () => {},
    id: null,
    size: 'md',
}

export default ColourBase
