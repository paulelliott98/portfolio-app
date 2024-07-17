import React from 'react';
import Snake from '../components/Snake';
import { Grid } from '@mui/material';
import ComponentDisabled from '../components/ComponentDisabled';

export default function SnakePage({ isSmallScreen }) {
  return (
    <section className="section-fixed">
      {isSmallScreen ? (
        <ComponentDisabled />
      ) : (
        <Grid
          item
          sx={{
            opacity: 0,
            animation: 'slideBottom 400ms ease forwards',
          }}
        >
          <Snake w={362} h={362} />
        </Grid>
      )}
    </section>
  );
}
