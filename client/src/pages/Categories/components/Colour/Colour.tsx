import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { ColorChangeHandler, SketchPicker } from 'react-color'

import { Box, Button, Popover } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'

import type { Category } from '../../../../types/Category'

import { useAppDispatch } from '../../../../hooks/ReduxHookWrappers'

import { initUpdateSingleCategory } from '../../../../redux/slices/categorySlice'

const boxW = 50

interface Props {
    category: Category
}

const Colour = ({ category }: Props) => {
    const dispatch = useAppDispatch()

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
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
        setAnchorEl(event.currentTarget);
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
            <Button
                aria-describedby={id}
                onClick={handleClick}
                sx={(theme) => ({
                    width: boxW,
                    height: boxW,
                    minWidth: boxW,
                    minHeight: boxW,
                    color: theme.palette.common.white,
                    cursor: 'pointer',
                    padding: 0,
                    backgroundColor: category.colour,
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
                        background: category.colour,
                        '& .Category_Colour__icon': {
                            opacity: 1,
                        },
                    },
                })}
            >
                <EditIcon className='Category_Colour__icon' />
            </Button>
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
                        onChangeComplete={handleSubmit}
                        presetColors={[
                            '#ee204d',
                            '#e84a5f',
                            '#d8737f',
                            '#fb8d1a',
                            '#f1c40f',
                            '#d3dd18',
                            '#4c9a2a',
                            '#16a085',
                            '#008080',
                            '#509af3',
                            '#34495e',
                            '#5650de',
                            '#8857e6',
                            '#881798',
                            '#2f1629',
                            '#ecf0f1',
                            '#0d1017',
                        ]}
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
