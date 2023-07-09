import { Palette } from '@mui/material/styles'

const palette: Partial<Palette> = {
    mode: 'dark',
    primary: {
        main: '#ba85ec',
        light: '#bbb0c5',
        dark: '#8638d6',
        contrastText: '#2f2f2f',
    },
    secondary: {
        main: '#2d3e50',
        light: '#576473',
        dark: '#1c2631',
        contrastText: '#ffffff'
    },
    background: {
        paper: '#2d3e50',
        default: '#1c2631',
    },
    common: {
        black: '#222',
        white: '#ecf0f1'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    error: {
        main: '#f44336',
        light: '#357373',
        dark: '#d32f2f',
        contrastText: '#ffffff',
    },
    warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
        contrastText: '#2f2f2f',
    },
    info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
        contrastText: '#ffffff',
    },
    success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
        contrastText: '#2f2f2f',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        'A100': '#f5f5f5',
        'A200': '#eeeeee',
        'A400': '#bdbdbd',
        'A700': '#616161',
    },
    text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
    },
    action: {
        active: '#fff',
        hover: 'rgba(255, 255, 255, 0.08)',
        selected: 'rgba(255, 255, 255, 0.16)',
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
        activatedOpacity: 0.24,
        disabledOpacity: 0.38,
        hoverOpacity: 0.08,
        selectedOpacity: 0.16,
        focusOpacity: 0.12,
    },
    // getContrastText: () => {},
    // augmentColor: () => {},
}

export default palette
