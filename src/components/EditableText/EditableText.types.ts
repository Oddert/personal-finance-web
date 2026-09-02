import type { SxProps, TypographyOwnProps } from '@mui/material';

export interface IProps {
    containerSx?: SxProps;
    headingProps: TypographyOwnProps;
    iconPosition?: 'start' | 'end';
    onChange: (value: string) => void;
    placeholder?: string;
    text: string;
    verticalCenter?: boolean;
}
