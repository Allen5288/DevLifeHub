import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '0.5px',
      fontSize: {
        xs: '1.75rem',
        sm: '2.125rem'
      }
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.25px',
      fontSize: {
        xs: '1.25rem',
        sm: '1.5rem'
      }
    },
    h6: {
      fontSize: {
        xs: '1.1rem',
        sm: '1.25rem'
      }
    }
  },
  shape: {
    borderRadius: 8,
  },
  transitions: {
    easing: {
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '@media (max-width: 600px)': {
            fontSize: '0.875rem',
            padding: '6px 16px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          '@media (max-width: 600px)': {
            top: '56px',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: 8,
          },
        },
        sizeSmall: {
          '@media (max-width: 600px)': {
            padding: 6,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              padding: '12px 14px',
            },
          },
        },
      },
    },
  },
});

export default theme;