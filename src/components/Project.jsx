import React from 'react';
import StyledChip from './StyledChip';
import { Grid, Typography } from '@mui/material';

// reusable component for projects
export default function Project({ techStack, name, dx, gitUrl, ...props }) {
  return (
    <Grid
      item
      container
      direction="column"
      {...props}
      style={{
        flexFlow: 'column nowrap',
        gap: '8px',
        marginTop: '16px',
        ...props.style,
      }}
    >
      <Typography className="slide-bottom" variant="h4">
        {name}
      </Typography>
      <Typography className="slide-bottom" variant="body1">
        {dx}
      </Typography>

      <Grid
        className="slide-bottom-no-fade"
        item
        container
        style={{ gap: '12px', margin: '8px 0 12px 0' }}
      >
        {techStack.map((item, i) => (
          <StyledChip key={i} label={item} />
        ))}
      </Grid>

      {!gitUrl ? null : (
        <Grid item container className="slide-bottom">
          <a href={gitUrl} target="_blank" rel="noopener noreferrer">
            <img
              className="github-logo"
              title="github"
              src={require('../images/github-mark-white.png')}
              alt="github logo"
            />
          </a>
        </Grid>
      )}
    </Grid>
  );
}
