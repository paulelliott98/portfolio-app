import React, { useState, useMemo } from 'react';

const utils = require('../../utils');

const initialPosition = 0;

export default function Stars() {
  const [topPosition] = useState(initialPosition);

  // create 3 layers of backgrounds, where each layer has one size of stars
  // layers with smaller stars will move faster (shorter duration) to create the parallax effect
  const stars = useMemo(() => {
    const n = 150;
    const sizes = [0.1, 0.3, 0.5, 0.7];
    const numStars = sizes.map((size) =>
      Math.floor((size / sizes.reduce((a, b) => a + b, 0)) * n)
    );
    const layers = [];

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const boxShadows = [];

      for (let j = 0; j < numStars[i]; j++) {
        const [x, y] = [
          Math.random() * 100, // vw
          Math.random() * 100, // vh
        ];

        const colors =
          i < sizes.length / 2
            ? ['#4CA9E1', '#FAECDB', '#FFFFFF']
            : ['#FAECDB', '#FFFFFF', '#D39A95'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Add multiple layered shadows for each star
        boxShadows.push(
          `${x}vw ${y}vh ${size + 0.5}px ${size}px ${color}`,
          `${x}vw ${y}vh ${size * 3}px ${size * 1.2}px ${color}`,
          `${x}vw ${y}vh ${size * 5}px ${size * 1.2}px ${color}`,
          `${x}vw ${y}vh ${size * 7}px ${size * 1.2}px ${color}`,
          `${x}vw ${y}vh ${size * 9}px ${size * 1.2}px ${color}`
        );
      }

      layers.push(
        <div
          key={i}
          className={`star-layer layer-${i + 1}`}
          style={{
            boxShadow: boxShadows.join(', '),
          }}
        ></div>
      );
    }

    return layers;
  }, []);

  return (
    <div style={{ position: 'fixed', top: `${topPosition}vh`, left: 0 }}>
      {stars}
    </div>
  );
}
