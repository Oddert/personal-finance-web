/* eslint-disable import/export */
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { RenderOptions, render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import store from '../redux/constants/store';
import theme from '../theme';

const Providers: JSXElementConstructor<{ children: ReactNode }> = ({
    children,
}) => {
    if (!children) {
        return <p></p>;
    }
    return (
        <ReduxProvider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                    {/* <ErrorBoundary fallback={<FallbackError />}>
                        <ErrorMessage>{children}</ErrorMessage>
                    </ErrorBoundary> */}
                    {children}
                </ThemeProvider>
            </LocalizationProvider>
        </ReduxProvider>
    );
};

export const customRenderer = (ui: ReactElement, options?: RenderOptions) =>
    render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRenderer as render };
