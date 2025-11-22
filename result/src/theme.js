import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B00',
      light: '#FF8A33',
      dark: '#E55A00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111111',
      secondary: '#555555',
      disabled: '#888888',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    success: {
      main: '#10B981',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Pretendard',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 24,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 4px 6px rgba(0, 0, 0, 0.07)',
    '0 10px 15px rgba(0, 0, 0, 0.1)',
    '0 20px 25px rgba(0, 0, 0, 0.1)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
    '0 4px 20px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          padding: '24px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
      },
    },
  },
});

export default theme;

