import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#22577A',
    },
    secondary: {
      main: '#38A3A5',
    },
    success: {
      main: '#57CC99',
    },
    info: {
      main: '#80ED99',
    },
    background: {
      default: '#EFF1ED',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#22577A',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#22577A',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#38A3A5',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#22577A',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#38A3A5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#38A3A5',
          '&:hover': {
            backgroundColor: '#57CC99',
          },
        },
        containedSecondary: {
          backgroundColor: '#22577A',
          '&:hover': {
            backgroundColor: '#38A3A5',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#22577A',
        },
      },
    },
  },
});

export default theme;
