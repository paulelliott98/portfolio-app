import { createTheme } from '@mui/material';

export const colors = {
  neonBlue: '#6bcfe4',
  neonPink: '#c792e9',
  neonGreen: '#ddfe90',
};

const theme = createTheme({
  palette: {},
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Nunito Sans, Helvetica',
          color: 'rgba(255,255,255,1)',
          position: 'relative',
          zIndex: 10,
        },
        body1: {
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: 2,
        },
        h1: {
          background: `linear-gradient(${colors.neonGreen}, ${colors.neonBlue}, ${colors.neonPink})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '100% 90%',
          fontFamily: "'Poppins', sans-serif",
          fontStyle: 'normal',
          fontWeight: '400',
          fontSize: '100px',
          marginInlineStart: '-5px',
          alignItems: 'center',
          letterSpacing: '-0.05em',
          whiteSpace: 'nowrap',
          textShadow: '0 0 25px rgb(65, 231, 150)',
          '@media (max-width: 900px)': {
            fontSize: '64px',
          },
        },
        h2: {
          fontFamily: 'Nunito Sans, sans-serif',
          fontSize: '24px',
          fontWeight: 500,
          lineHeight: 2,
        },
        h4: {
          color: colors.neonPink,
          fontSize: '28px',
          fontWeight: '500',
          textShadow: '0 0 10px #902cce',
          textTransform: 'lowercase',
          letterSpacing: '0em',
          width: 'fit-content',
        },
        h5: {
          font: '800 20px "Nunito Sans"',
        },
        gutterBottom: {
          marginBottom: '1.5rem',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingBlock: '12px',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          lineHeight: '28px',
          background: 'none',
          color: '#ffffffcc',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transitionDuration: '0s',
          fontSize: '14px',
          paddingBlock: '8px',
          borderRadius: '8px',
          color: '#ffffff77',
          '&:hover': {
            background: '#ffffff11',
            color: '#fff',
          },
        },
      },
      defaultProps: {
        disableRipple: true,
        draggable: false,
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '0 2px',
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
          fontFamily: '"DM Sans", Roboto',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Sans", Roboto',
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
          fontFamily: '"DM Sans", Roboto',
          textTransform: 'capitalize',
          '&.Mui-disabled': {
            color: 'rgba(255,255,255,0.3)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

export default theme;
