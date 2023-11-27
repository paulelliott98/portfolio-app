import React from 'react';
import { Chip, Typography } from '@mui/material';
import { colors } from '../theme';

const StyledChip = ({ ...props }) => {
  return (
    <Chip
      {...props}
      label={
        <Typography
          sx={{
            color: colors.neonBlue,
            textShadow: `0 0 2px ${colors.neonBlue}`,
            fontSize: '14px',
          }}
        >
          {props.label}
        </Typography>
      }
      sx={{
        backgroundColor: 'rgba(46,46,65,0.75)',
        backdropFilter: 'blur(20px)',
      }}
    />
  );
};

export default StyledChip;
