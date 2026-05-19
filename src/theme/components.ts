import type { ThemeOptions } from '@mui/material';

import { ColorTranslator } from 'colortranslator';

const components: ThemeOptions['components'] = {
    MuiAppBar: {
        styleOverrides: {
            root: ({ theme }) => {
                const colour = new ColorTranslator(theme.palette.primary.dark);
                return {
                    background: `rgba(${String(colour.R)}, ${String(colour.G)}, ${String(colour.B)}, 0.5)`,
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
                style: ({ theme }) => ({
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
                style: ({ theme }) => ({
                    color: theme.palette.primary.light,
                }),
            },
        ],
    },
};

export default components;
