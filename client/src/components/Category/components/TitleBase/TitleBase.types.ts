export interface IProps {
    colour: string
    editable: boolean
    handleChange?: (value: string) => void
    text: string
    showBorder?: boolean
    size?: 'xs'|'sm'|'md'|'lg'|'xl'
}
