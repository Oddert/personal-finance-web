import { useMemo } from 'react'
import { Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

import EditableText from '../../../EditableText/EditableText'

interface Props {
    colour: string
    editable: boolean
    handleChange?: (value: string) => void
    text: string
    size: 'xs'|'sm'|'md'|'lg'|'xl'
}

const sizeMap = {
    xs: '10px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
}

const TitleBase = ({ colour, editable, handleChange, text, size }: Props) => {
    const headingProps = useMemo(() => {
        console.log(sizeMap, size, sizeMap[size])
        return {
            sx: {
                borderBottom: `2px solid ${colour}`,
                alignSelf: 'stretch',
                fontSize: sizeMap[size]
            },
            variant: 'h3' as Variant | 'inherit' | undefined,
        }
    }, [colour, size])

    if (editable) {
        return (
            <EditableText
                headingProps={headingProps}
                onChange={handleChange}
                text={text}
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
