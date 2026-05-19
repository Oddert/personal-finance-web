/* eslint-disable import/export */
import type {
    JSX,
    JSXElementConstructor,
    PropsWithChildren,
    ReactElement,
    ReactNode,
} from 'react';
import { Provider, Provider as ReduxProvider } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { type RenderOptions, render } from '@testing-library/react';

import reduxStore, {
    type AppStore,
    type RootState,
    setupStore,
} from '../redux/constants/store';
import theme from '../theme';

// eslint-disable-next-line react-refresh/only-export-components
const Providers: JSXElementConstructor<{ children: ReactNode }> = ({
    // eslint-disable-next-line react/prop-types
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

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export { customRenderer as render };
