import React from 'react';
import { Typography } from '@mui/material';
import { colors } from '../theme';
import GridGlass from './GridGlass';

const StyledChip = ({ ...props }) => {
  return (
    <GridGlass
      item
      container
      alignItems="center"
      justifyContent="center"
      {...props}
      style={{
        padding: '4px 12px',
        borderRadius: '24px',
        width: 'fit-content',
        maxWidth: '50vw',
        ...props.style,
      }}
    >
      {/* <Tooltip title={props.label} disableInteractive> */}
      <Typography
        noWrap
        style={{
          color: colors.neonBlue,
          textShadow: `0 0 2px ${colors.neonBlue}`,
          padding: 0,
          maxWidth: '100%',
          fontSize: '14px',
        }}
      >
        {props.label}
      </Typography>
      {/* </Tooltip> */}
    </GridGlass>
  );
};

export default StyledChip;
