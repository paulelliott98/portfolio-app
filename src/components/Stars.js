import React, { useRef, useEffect } from "react";

const utils = require("../utils");

// component for generating stars background
export default function Stars({ n }) {
  var starsRef = useRef(null);

  useEffect(() => {
    function generateStars(n) {
      let stars = [];
      for (let i = 0; i < n; i++) {
        let [x, y, size] = [
          (Math.round(Math.random() * 1000) / 1000) * 100,
          (Math.round(Math.random() * 1000) / 1000) * 400,
          utils.randChoice([0.7, 1.3, 2]),
        ];

        let style = {
          left: `${x}vw`,
          top: `${y}vh`,
          width: `${size}px`,
          height: `${size}px`,
          position: "fixed",
          zIndex: `-${100 - size}`,
          background: `#fff`,
          borderRadius: "50%",
          boxShadow: `0 0 2px 0.3px`,
          animation: `animStar ${Math.pow(size, 2) * 200}s ${
            utils.isInViewport(x, y) ? "1 linear forwards" : "linear infinite"
          }`,
          content: ``,
        };

        let jsx = <div key={i} style={style}></div>;
        stars.push(jsx);
      }
      return stars;
    }
    starsRef.current = generateStars(n);
  }, [n]);

  return (
    <>
      <div className="space-bg"></div>
      {starsRef.current}
    </>
  );
}
