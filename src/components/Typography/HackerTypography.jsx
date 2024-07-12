import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { randInt } from '../../utils';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789()%-+@#';

// Return original text until index i-1, and jumbled text afterwards
const getJumbledText = (i, text) => {
  return String(text)
    .split('')
    .map((ch, index) => {
      if (index >= i && ch !== ' ') {
        const randBinary = randInt(0, 1);
        const pick = alphabet[randInt(0, alphabet.length - 1)];
        return randBinary && isNaN(pick) ? pick.toUpperCase() : pick;
      }
      return ch;
    })
    .join('');
};

const HackerTypography = ({ text, delay = 80, ...props }) => {
  const [letters, setLetters] = useState(getJumbledText(0, text));
  const isTouch = useRef(false);
  const interval = useRef(null);

  const changeLetters = useCallback(() => {
    let i = 0;
    interval.current = setInterval(() => {
      if (i > text.length) {
        clearInterval(interval.current);
        return;
      } else {
        setLetters(getJumbledText(i, text));
        i++;
      }
    }, delay);
  }, [text, delay]);

  useEffect(() => {
    changeLetters();
    return () => {
      clearInterval(interval.current);
    };
  }, [changeLetters]);

  const handleMouseEnter = () => {
    if (isTouch.current) return;
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setLetters(getJumbledText(0, text));
    }, delay);
  };

  const handleMouseLeave = () => {
    clearInterval(interval.current);
    changeLetters();
  };

  return (
    <Typography
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => {
        isTouch.current = true;
      }}
      {...props}
    >
      {letters}
    </Typography>
  );
};

export default HackerTypography;
