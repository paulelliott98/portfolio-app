import React, { useState, useMemo } from 'react';

const utils = require('../../utils');

const initialPosition = 0;

export default function Stars() {
  const [topPosition] = useState(initialPosition);

  // create 3 layers of backgrounds, where each layer has one size of stars
  // layers with smaller stars will move faster (shorter duration) to create the parallax effect
  const stars = useMemo(() => {
    const n = 150;
    let sizes = [0.1, 0.3, 0.5, 0.7]; // sizes of stars in px
    let numStars = new Array(sizes.length); // number of stars of each size. Sum to ~ n
    const sizesSum = sizes.reduce((partialSum, a) => partialSum + a, 0);
    for (let i in sizes) {
      numStars[i] = Math.floor((sizes[i] / sizesSum) * n);
    }

    numStars = numStars.reverse();

    let starsDivs = [];

    for (let i = 0; i < numStars.length; i++) {
      let size = sizes[i];

      let style1 = {
        position: 'absolute',
        zIndex: `-${500 - size}`,
        left: `0`,
        top: `0`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `50% 50%`,
      };

      let style2 = JSON.parse(JSON.stringify(style1));
      style2['top'] = '100vh';

      let boxShadows = ``;

      for (let j = 0; j < numStars[i]; j++) {
        let [x, y] = [
          (Math.round(Math.random() * 1000) / 1000) * 100, // vw
          (Math.round(Math.random() * 1000) / 1000) * 100, // vh
        ];

        let colors;
        if (i < sizes.length / 2) colors = ['#4CA9E1', '#FAECDB', '#FFFFFF'];
        else colors = ['#FAECDB', '#FFFFFF', '#D39A95'];

        const color = utils.randChoice(colors);

        // offset-x | offset-y | blur-radius | spread-radius | color
        let boxShadow = `${x}vw ${y}vh ${size +
          0.5}px ${size}px ${color}, ${x}vw ${y}vh ${size * 3}px ${size *
          1.2}px ${color}, ${x}vw ${y}vh ${size * 5}px ${size *
          1.2}px ${color}, ${x}vw ${y}vh ${size * 7}px ${size *
          1.2}px ${color}, ${x}vw ${y}vh ${size * 9}px ${size *
          1.2}px ${color}`;

        if (j > 0) boxShadows += `, `;

        boxShadows += `${boxShadow}`;
      }

      style1['boxShadow'] = boxShadows; // string of box shadows
      starsDivs.push(<div key={i} style={style1}></div>);

      style2['boxShadow'] = boxShadows; // string of box shadows
      starsDivs.push(<div key={i + sizes.length} style={style2}></div>);
    }
    return starsDivs;
  }, []);

  //   useEffect(() => {
  //     function moveBackground() {
  //       const y = document.documentElement.scrollTop;
  //       const scrollProportion =
  //         y / (document.documentElement.scrollHeight - window.innerHeight);
  //       setTopPosition(initialPosition + 4 * scrollProportion);
  //     }

  //     function handleScroll() {
  //       moveBackground();
  //     }
  //     document.addEventListener('scroll', handleScroll);
  //     document.addEventListener('touchmove', handleScroll);
  //     return () => {
  //       document.removeEventListener('scroll', handleScroll);
  //       document.removeEventListener('touchmove', handleScroll);
  //     };
  //   }, []);

  return (
    <div style={{ position: 'fixed', top: `${topPosition}vh`, left: 0 }}>
      {stars}
    </div>
  );
}
