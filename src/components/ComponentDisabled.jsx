import SystemSecurityUpdateWarningIcon from '@mui/icons-material/SystemSecurityUpdateWarning';
import { Grid, Typography } from '@mui/material';
import React from 'react';

export default function ComponentDisabled() {
  return (
    <Grid
      container
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 3,
        padding: '2em',
        gap: '2em',
      }}
    >
      <SystemSecurityUpdateWarningIcon sx={{ width: '8em', height: '8em' }} />
      <Typography align="center" variant="body1">
        This feature has been disabled on touch devices and small screens
      </Typography>
    </Grid>
  );
}
