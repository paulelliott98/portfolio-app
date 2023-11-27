import { createTheme } from '@mui/material';

export const colors = {
  neonBlue: '#6bcfe4',
  neonPink: '#c792e9',
};

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'DM Sans, Helvetica',
          color: 'rgba(255,255,255,1)',
        },
        h4: {
          color: colors.neonPink,
          fontSize: '28px',
          fontWeight: '500',
          textShadow: '0 0 10px #902cce',
          textTransform: 'lowercase',
          letterSpacing: '0.04em',
        },
        h5: {
          fontSize: '22px',
          fontFamily: 'DM Sans',
          fontWeight: '500',
        },
      },
    },
  },
});

export default theme;
