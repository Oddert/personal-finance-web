import { Components } from '@mui/material/styles';

import convert from 'color-convert';

const components: Components = {
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }: { theme: any }) => {
                const colour = convert.hex.rgb(theme.palette.primary.dark);
                return {
                    background: `rgba(${colour[0]}, ${colour[1]}, ${colour[2]}, 0.5)`,
                    backdropFilter: 'blur(8px)',
                };
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: () => {
                return {
                    textTransform: 'none',
                };
            },
        },
        variants: [
            {
                props: { variant: 'text' },
                style: ({ theme }: { theme: any }) => ({
                    color: theme.palette.primary.light,
                }),
            },
        ],
    },
    MuiPaper: {
        variants: [
            {
                props: { elevation: 0 },
                style: { '--Paper-overlay': 'none' },
            },
        ],
    },
    MuiCheckbox: {
        variants: [
            {
                props: { checked: true },
                style: ({ theme }: { theme: any }) => ({
                    color: theme.palette.primary.light,
                }),
            },
        ],
    },
};

export default components;
