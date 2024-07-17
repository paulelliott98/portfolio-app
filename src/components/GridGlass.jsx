import React, { forwardRef } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const classNames = require('classnames');

const StyledGridGlass = styled(Grid)({
  display: 'flex',
  position: 'relative',
  flexFlow: 'column nowrap',
  gap: '8px',
  backgroundColor: 'var(--bg-color-2)',
  boxShadow: '0px 0px 8px 4px rgba(255, 255, 255, 0.08)',
  outline: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  color: '#fff',
  padding: '1.5em 2em',
  p: {
    paddingBlockEnd: '0.5em',
  },
});

const GridGlass = forwardRef((props, ref) => {
  return (
    <StyledGridGlass
      ref={ref}
      {...props}
      className={classNames(props.className, 'rotating-border ')}
    >
      {props.children}
    </StyledGridGlass>
  );
});

export default GridGlass;
