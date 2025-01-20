import { SxProps } from '@mui/material';
import { Theme } from '@emotion/react';

export interface IProps {
    colour?: string;
    onSubmit: (colour: string) => void;
    popoverId?: string;
    sx?: SxProps<Theme> | undefined;
}
