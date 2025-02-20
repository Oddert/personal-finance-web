import { AppBar as MuiAppBar, styled } from '@mui/material';

import { headerDrawerOpenWidth } from '../../constants/appConstants';

import { AppBarProps } from './Header.types';

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open, discreet }) => open && !discreet,
            style: {
                marginLeft: headerDrawerOpenWidth,
                width: `calc(100% - ${headerDrawerOpenWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
    zIndex: theme.zIndex.drawer + 1,
}));
