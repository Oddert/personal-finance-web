import { FC } from 'react';

import { Container } from '@mui/material';

import { IProps } from './ResponsiveContainer.types';

const ResponsiveContainer: FC<IProps> = ({ children }) => {
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
