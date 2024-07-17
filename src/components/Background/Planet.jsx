import React, { useState } from 'react';

const initialPlanetBottomVh = 10;

export default function Planet() {
  const [planetYPosition] = useState(initialPlanetBottomVh);

  //   useEffect(() => {
  //     function movePlanet() {
  //       const y = document.documentElement.scrollTop;
  //       const scrollProportion =
  //         y / (document.documentElement.scrollHeight - window.innerHeight);
  //       setPlanetYPosition(initialPlanetBottomVh - 8 * scrollProportion);
  //     }

  //     function handleScroll() {
  //       movePlanet();
  //     }

  //     document.addEventListener('scroll', handleScroll);
  //     document.addEventListener('touchmove', handleScroll);
  //     return () => {
  //       document.removeEventListener('scroll', handleScroll);
  //       document.removeEventListener('touchmove', handleScroll);
  //     };
  //   }, []);

  return (
    <div
      className="planet"
      style={{
        bottom: `${planetYPosition}vh`,
      }}
    />
  );
}
