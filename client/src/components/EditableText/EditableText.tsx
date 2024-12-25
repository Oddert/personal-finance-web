import { useCallback, useEffect, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

import { Edit as EditIcon } from '@mui/icons-material'

interface Props {
    containerSx: any
    headingProps: any
    iconPosition: 'start'|'end'
    onChange: (value: string) => void
    text: string
    verticalCenter?: boolean
}

const EditableText = ({
    containerSx,
    headingProps,
    iconPosition,
    onChange,
    text,
    verticalCenter,
}: Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')

    const handleBlur = useCallback(() => {
        setOpen(false)
        onChange(value)
    }, [onChange, value])

    useEffect(() => {
        setValue(text)
    }, [text])

    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: iconPosition === 'end' ? 'row-reverse' : 'row',
                alignItems: verticalCenter ? 'center' : 'flex-start',
                position: 'relative',
                '& .EditableText_open': {
                    transition: '.1s linear',
                    opacity: 0,
                    color: theme.palette.common.white,
                    paddingLeft: 0,
                    paddingRight: 0,
                    minWidth: '40px',
                },
                '& .EditableText__title': {
                    display: 'flex',
                    alignItems: verticalCenter ? 'center' : 'flex-start'
                },
                '&:hover': {
                    '& .EditableText_open': {
                        opacity: 1,
                    },
                },
                ...containerSx,
            })}
        >
            <Button
                className='EditableText_open'
                onClick={() => setOpen(true)}
                sx={{
                    position: 'absolute',
                    left: '-100%',
                }}
            >
                <EditIcon />
            </Button>
            {open ? (
                <TextField
                    autoFocus
                    onBlur={handleBlur}
                    onChange={(e) => setValue(e.target.value)}    
                    value={value}
                />
            ) : (
                <Typography className='EditableText__title' {...headingProps}>
                    {text}
                </Typography>
            )}
        </Box>
    )
}

EditableText.defaultProps = {
    containerSx: {},
    headingProps: {},
    iconPosition: 'start',
    onChange: () => {},
    text: '',
}

export default EditableText
