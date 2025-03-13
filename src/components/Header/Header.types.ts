import { AppBarProps as MuiAppBarProps } from '@mui/material';

export interface AppBarProps extends MuiAppBarProps {
    discreet?: boolean;
    open?: boolean;
}
