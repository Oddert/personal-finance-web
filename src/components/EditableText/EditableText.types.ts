import type { SxProps } from '@mui/material';
import type { TypographyProps } from '@mui/system';

export interface IProps {
    containerSx?: SxProps;
    headingProps: Partial<TypographyProps>;
    iconPosition?: 'start' | 'end';
    onChange: (value: string) => void;
    placeholder?: string;
    text: string;
    verticalCenter?: boolean;
}
