import React, { forwardRef } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGridGlass = styled(Grid)(() => ({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(6px)',
  outline: '1.5px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: '#fff',
  padding: '1em 2em',
  p: {
    paddingBlockEnd: '0.5em',
  },
}));

const GridGlass = forwardRef((props, ref) => {
  return (
    <StyledGridGlass ref={ref} {...props}>
      {props.children}
    </StyledGridGlass>
  );
});

export default GridGlass;
