import { createTheme } from '@mui/material';

export const colors = {
  neonBlue: '#6bcfe4',
  neonPink: '#c792e9',
  neonGreen: '#ddfe90',
};

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans, Helvetica',
          color: 'rgba(255,255,255,1)',
        },
        body1: {
          fontSize: '16px',
        },
        h4: {
          color: colors.neonPink,
          fontSize: '28px',
          fontWeight: '500',
          textShadow: '0 0 10px #902cce',
          textTransform: 'lowercase',
          letterSpacing: '0.04em',
          width: 'fit-content',
        },
        h5: {
          fontSize: '22px',
          fontFamily: 'DM Sans',
          fontWeight: '500',
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          color: '#fff',
          //   '&.Mui-checked': {
          //     color: colors.neonGreen,
          //   },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans, Roboto',
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans, Roboto',
          textTransform: 'capitalize',
          //   color: colors.neonGreen,
        },
        // contained: {},
      },
    },
  },
});

export default theme;
