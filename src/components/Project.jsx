import React from 'react';
import StyledChip from './StyledChip';
import { Grid, Typography } from '@mui/material';
import GridGlass from './GridGlass';

// reusable component for projects
export default function Project({ techStack, name, dx, gitUrl, ...props }) {
  return (
    <GridGlass
      item
      container
      direction="column"
      style={{
        flexFlow: 'column nowrap',
        gap: '8px',
        marginTop: '24px',
        ...props.style,
      }}
      {...props}
    >
      <Typography variant="h4">{name}</Typography>
      <Typography variant="body1">{dx}</Typography>

      <Grid item container style={{ gap: '12px', margin: '8px 0 12px 0' }}>
        {techStack.map((item, i) => (
          <StyledChip
            key={i}
            label={item}
            style={{ backdropFilter: 'none', background: 'none' }}
          />
        ))}
      </Grid>

      {!gitUrl ? null : (
        <Grid item container>
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
    </GridGlass>
  );
}
