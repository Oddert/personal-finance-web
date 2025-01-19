import React, { JSX } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { RenderOptions, render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';

import store from '../redux/constants/store';
import theme from '../theme';

const Providers: React.FC<{ children: JSX.Element }> = ({ children }) => (
    <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ReduxProvider>
);

const customRenderer = (ui: React.ReactElement, options?: RenderOptions) =>
    render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRenderer as render };
