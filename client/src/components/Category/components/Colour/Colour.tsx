import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { ColorChangeHandler, SketchPicker } from 'react-color'

import { Box, Button, Popover } from '@mui/material'

import { defaultCategoryColours } from '../../../../constants/categoryConstants'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'
import ColourBase from '../ColourBase/ColourBase'

interface Props {
    category: Category
}

const Colour = ({ category }: Props) => {
    const dispatch = useAppDispatch()

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement|null>(null)
    const [hasChanged, setHasChanged] = useState<boolean>(false)
    const [originalColour, setOriginalColour] = useState<string>('#bec3c7')
    const [colour, setColour] = useState<string>('#bec3c7')

    const handleSubmit = useCallback(() => {
        dispatch(initUpdateSingleCategory({
            category: { ...category, colour: colour },
        }))
        setAnchorEl(null)
    }, [category, colour, dispatch])
    
    const handleChange: ColorChangeHandler = useCallback((change) => {
        setColour(change.hex)
        if (!hasChanged) {
            setHasChanged(true)
        }
    }, [hasChanged])

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = useCallback(() => {
        setAnchorEl(null)
        setHasChanged(false)
        setColour(originalColour)
    }, [originalColour])
    
    useEffect(() => {
        setColour(category.colour)
        setOriginalColour(category.colour)
    }, [category])

    const open = Boolean(anchorEl)
    const id = open ? 'choose-category-colour' : undefined

    return (
        <Box
            className='Category_Colour'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <ColourBase
                asButton
                colour={category.colour}
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
                        color={colour}
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
                            Cancel
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
                            Save
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </Box>
    )
}

export default Colour
