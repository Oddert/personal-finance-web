import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

import EditableText from '../../../EditableText/EditableText'

interface Props {
    colour: string
    editable: boolean
    handleChange?: (value: string) => void
    text: string
    showBorder?: boolean
    size: 'xs'|'sm'|'md'|'lg'|'xl'
}

const sizeMap = {
    xs: '10px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
}

const TitleBase = ({
    colour,
    editable,
    handleChange,
    text,
    showBorder,
    size,
}: Props) => {
    const headingProps = useMemo(() => {
        return {
            sx: {
                alignSelf: 'stretch',
                borderBottom: showBorder ? `2px solid ${colour}` : 'none',
                fontSize: sizeMap[size]
            },
            variant: 'h3' as Variant | 'inherit' | undefined,
        }
    }, [colour, size, showBorder])

    if (editable) {
        return (
            <EditableText
                headingProps={headingProps}
                iconPosition='start'
                onChange={handleChange}
                text={text}
                verticalCenter
            />
        )
    }
    return (
        <Typography {...headingProps}>
            {text}
        </Typography>
    )
}

TitleBase.defaultProps = {
    colour: '',
    editable: true,
    handleChange: () => {},
    text: '',
    size: 'md',
}

export default TitleBase
