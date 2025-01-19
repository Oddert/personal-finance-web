import { SxProps } from '@mui/material'

export interface IProps {
    containerSx?: SxProps
    headingProps: any
    iconPosition?: 'start'|'end'
    onChange: (value: string) => void
    placeholder?: string
    text: string
    verticalCenter?: boolean
}
