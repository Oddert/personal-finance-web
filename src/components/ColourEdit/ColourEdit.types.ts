import type { SxProps, Theme } from '@mui/material';

export interface IProps {
    colour?: string;
    onSubmit: (colour: string) => void;
    popoverId?: string;
    sx?: SxProps<Theme> | undefined;
}
