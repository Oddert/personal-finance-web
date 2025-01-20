import { FC } from 'react';

import { Container } from '@mui/material';

import type { IProps } from './ResponsiveContainer.types';

/**
 * Higher order component to provide a container which adapts to the users screen width in increments.
 *
 * Stepped increments ensure consistency, reduce jitter, and eliminates edge-cases encountered when using fully responsive layout.
 * @category Hocs
 * @subcategory Responsive Container
 * @component
 * @param props.children The components to be rendered inside the container.
 */
const ResponsiveContainer: FC<IProps> = ({ children }) => {
    return (
        <Container
            sx={(theme) => ({
                transition: '.2s linear',
                minHeight: `calc(100vh)`,
                margin: '0 auto',
                padding: '0 16px',
                [theme.breakpoints.down('xl')]: {
                    maxWidth: '1300px',
                },
                [theme.breakpoints.down('lg')]: {
                    maxWidth: '900px',
                },
                [theme.breakpoints.down('md')]: {
                    maxWidth: '768px',
                },
                [theme.breakpoints.down('sm')]: {
                    padding: '4px',
                    maxWidth: '90vw',
                },
            })}
        >
            {children}
        </Container>
    );
};

export default ResponsiveContainer;
