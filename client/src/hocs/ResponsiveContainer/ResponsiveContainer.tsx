import { FC, JSX } from 'react';

import { Container } from '@mui/material';

const ResponsiveContainer: FC<{ children: JSX.Element }> = ({ children }) => {
    return (
        <Container
            sx={(theme) => ({
                transition: '.2s linear',
                [theme.breakpoints.down('sm')]: {
                    padding: '4px',
                }
            })}
        >
            {children}
        </Container>
    )
}

export default ResponsiveContainer;
