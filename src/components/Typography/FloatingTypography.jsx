import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { randChoice, randInt } from '../../utils';

// const getDisassembleAnimations = (animationProperties) => {
//   const obj = {};
//   animationProperties.forEach((prop, index) => {
//     obj[`#char_${index}`] = {
//       [`@keyframes disassemble_${index}`]: {
//         from: {
//           transform: 'translateY(0)',
//         },
//         '100%': {
//           transform: `translate(${prop.translateX}px, ${prop.translateY}px) rotate(${prop.rotate}deg)`,
//         },
//       },
//       animation: `disassemble_${index} ${prop.duration}ms ease both`,
//     };
//   });
//   return obj;
// };

const StyledTypography = styled(Typography)((props) => ({
  // '&:hover': { ...getDisassembleAnimations(props.animationproperties) },
}));

const StyledChar = styled('span')((props) => ({
  [`@keyframes assemble_${props.index}`]: {
    '0%': {
      transform: `translate(${props.translateX}px, ${props.translateY}px) rotate(${props.rotate}deg)`,
      opacity: 0,
    },
    '80%': {
      opacity: 1,
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
  animation: `assemble_${props.index} ${props.duration}ms ease both`,
  font: 'inherit',
  color: 'inherit',
  background: 'inherit',
  display: 'inline-flex',
  padding: '2.5px',
  whiteSpace: 'pre',
}));

const makeAnimationProperties = (text) => {
  return text.split('').map((_, index) => ({
    translateX: randInt(20, 60) * randChoice([1, -1]),
    translateY: randInt(20, 60) * (index % 2 === 0 ? 1 : -1),
    rotate: randInt(8, 180) * randChoice([1, -1]),
    duration: randInt(1000, 2000),
  }));
};

const FloatingTypography = ({ text, ...props }) => {
  const animationProperties = makeAnimationProperties(text);
  return (
    <StyledTypography {...props} animationproperties={animationProperties}>
      {text.split('').map((ch, index) => {
        if (ch === ' ') return <span key={index}>&nbsp;</span>;
        const prop = animationProperties[index];
        return (
          <StyledChar
            id={`char_${index}`}
            index={index}
            translateX={prop.translateX}
            translateY={prop.translateY}
            rotate={prop.rotate}
            duration={prop.duration}
            key={index}
          >
            {ch}
          </StyledChar>
        );
      })}
    </StyledTypography>
  );
};

export default FloatingTypography;
