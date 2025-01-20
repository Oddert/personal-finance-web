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
};

export default components;
