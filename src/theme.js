import { createTheme } from '@mui/material';

export const colors = {
  neonBlue: '#6bcfe4',
  neonPink: '#c792e9',
  neonGreen: 'rgb(221, 254, 144)',
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
            // color: colors.neonGreen,
          },
        },
      },
    },
  },
});

export default theme;
