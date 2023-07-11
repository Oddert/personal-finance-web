import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { CssBaseline, ThemeProvider } from '@mui/material'

import store from './redux/constants/store';

import theme from './theme/'

import reportWebVitals from './reportWebVitals'

import App from './components/App/'

import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <App />
            </ThemeProvider>
        </ReduxProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
