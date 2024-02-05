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
        h1: {
          background: `linear-gradient(${colors.neonGreen}, ${colors.neonBlue}, ${colors.neonPink})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '100% 90%',
          fontFamily: "'Poppins', sans-serif",
          fontStyle: 'normal',
          fontWeight: '400',
          fontSize: '80px',
          marginInlineStart: '-5px',
          alignItems: 'center',
          letterSpacing: '-0.05em',
          whiteSpace: 'nowrap',
          textShadow: '0 0 25px rgb(65, 231, 150)',
          '@media (min-width: 600px)': {
            fontSize: '112px',
          },
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
          font: '400 28px "Space Mono"',
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
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '14px',
          fontFamily: 'Space Mono, Roboto',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Space Mono, Roboto',
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
          '&.Mui-disabled': {
            color: 'rgba(255,255,255,0.3)',
          },
        },
      },
    },
  },
});

export default theme;
