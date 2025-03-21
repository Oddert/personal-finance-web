/* eslint-disable import/export */
import {
    JSXElementConstructor,
    PropsWithChildren,
    ReactElement,
    ReactNode,
} from 'react';
import { Provider, Provider as ReduxProvider } from 'react-redux';

import { RenderOptions, render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import reduxStore, {
    AppStore,
    RootState,
    setupStore,
} from '../redux/constants/store';
import theme from '../theme';

const Providers: JSXElementConstructor<{ children: ReactNode }> = ({
    children,
}) => {
    return (
        <ReduxProvider store={reduxStore}>
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

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
}

export const renderWithProviders = (
    ui: ReactElement,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {},
) => {
    const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
        return <Provider store={store}>{children}</Provider>;
    };
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export * from '@testing-library/react';

export { customRenderer as render };
