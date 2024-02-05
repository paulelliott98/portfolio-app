import React, { forwardRef } from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGridGlass = styled(Grid)({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(6px)',
  boxShadow: '0 0 16px 4px rgba(255,255,255,0.06)',
  WebkitBackdropFilter: 'blur(6px)',
  outline: '1.5px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  color: '#fff',
  padding: '1.5em 2em',
  p: {
    paddingBlockEnd: '0.5em',
  },
});

const GridGlass = forwardRef((props, ref) => {
  return (
    <StyledGridGlass ref={ref} {...props}>
      {props.children}
    </StyledGridGlass>
  );
});

export default GridGlass;
