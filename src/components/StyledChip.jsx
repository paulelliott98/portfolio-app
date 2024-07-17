import React from 'react';
import { Typography } from '@mui/material';
import { colors } from '../theme';
import GridGlass from './GridGlass';

const StyledChip = ({ label, ...props }) => {
  return (
    <GridGlass
      item
      container
      alignItems="center"
      justifyContent="center"
      {...props}
      sx={{
        padding: '8px 12px',
        borderRadius: '24px',
        width: 'fit-content',
        maxWidth: '50vw',
        background: 'rgb(67 67 67 / 30%)',
        backdropFilter: 'blur(8px)',
        ...props.style,
      }}
    >
      <Typography
        noWrap
        style={{
          color: colors.neonBlue,
          padding: 0,
          maxWidth: '100%',
          fontSize: '14px',
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </GridGlass>
  );
};

export default StyledChip;
