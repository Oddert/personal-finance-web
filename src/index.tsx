import { Provider as ReduxProvider } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import ReactDOM from 'react-dom/client';

import App from './components/App/';
import FallbackError from './components/FallbackError';
import ErrorBoundary from './hocs/ErrorBoundary';
import ErrorMessage from './hocs/ErrorMessage';
import store from './redux/constants/store';
// import reportWebVitals from './reportWebVitals';
import theme from './theme/';

import './common/i18n';

import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
                <ErrorBoundary fallback={<FallbackError />}>
                    <ErrorMessage>
                        <App />
                    </ErrorMessage>
                </ErrorBoundary>
            </ThemeProvider>
        </LocalizationProvider>
    </ReduxProvider>,
);

// <React.StrictMode>
// </React.StrictMode>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
