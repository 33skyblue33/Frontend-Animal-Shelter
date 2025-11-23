import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4FD1C5', 
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF9F43', 
    },
    background: {
      default: '#FFF8E7', 
      paper: '#ffffff',
    },
    text: {
      primary: '#2D3436',
    },
    
    custom: {
      cardOrange: '#FF9F43',
      cardBlue: '#54A0FF',
      cardGreen: '#2ECC71',
      cardRed: '#FF6B6B',
    }
  },
  typography: {
    fontFamily: "'Fredoka', sans-serif", 
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', 
      fontSize: '1rem',
    }
  },
  shape: {
    borderRadius: 24, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, 
          padding: '10px 24px',
          boxShadow: '0 4px 0 rgba(0,0,0,0.1)', 
          '&:hover': {
             transform: 'translateY(-2px)',
          }
        },
      },
    },
  },
});