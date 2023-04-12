import HomePage from "./pages/HomePage";
import VisualizerToolPage from "./pages/VisualizerToolPage";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const utils = require("./utils");

var isMobile =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

export default function App() {
  const [width, setWidth] = useState(window.innerWidth);
  isMobile = isMobile === true || width <= 992;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  let documentHeight = useRef(utils.getPageHeight(document));

  function getDocumentHeight(height) {
    documentHeight.current = height;
  }

  let navRef = useRef(null);

  function getNavRef(ref) {
    navRef.current = ref;
  }

  let isScrolling = useRef(false);
  let isUserScrolling = useRef(false);
  let isTouchMove = useRef(false);

  let [lastPagePos, currPagePos] = [
    useRef(document.documentElement.scrollTop),
    useRef(document.documentElement.scrollTop),
  ];
  let timer = useRef(null);

  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    function handleWheel() {
      isUserScrolling.current = true;
    }

    function handleTouchMove() {
      isTouchMove.current = true;
    }

    function handleScroll() {
      isScrolling.current = true;

      lastPagePos.current = currPagePos.current;
      currPagePos.current = document.documentElement.scrollTop;

      const offset = 20;

      if (
        navRef.current !== null &&
        currPagePos.current > offset &&
        currPagePos.current <
          documentHeight.current - window.innerHeight - offset
      ) {
        if (currPagePos.current > lastPagePos.current) {
          // console.log("Scrolling down");
          if (isUserScrolling.current === true || isMobile === true) {
            navRef.current.style.visibility = "hidden";

            const dy = `-${navRef.current.clientHeight + 3}px`;
            navRef.current.style.transform = `translateY(${dy})`;
          }
        } else {
          // console.log("Scrolling up");
          navRef.current.style = ""; // set to default defined css style
        }
      }

      if (timer.current !== null) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        isScrolling.current = false; // page stopped moving
      }, 50);
    }

    let to = null;

    if (!isScrolling.current) {
      // if not a hash link, scroll to top
      if (hash === "") {
        window.scrollTo(0, 0);
      }
      // else scroll to id
      else {
        to = setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView();
          }
        }, 0);
      }
    }

    window.addEventListener("resize", handleWindowSizeChange);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchmove", handleTouchMove);

    isUserScrolling.current = false;
    isTouchMove.current = false;

    return () => {
      clearTimeout(to);
      window.removeEventListener("resize", handleWindowSizeChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [
    pathname,
    hash,
    key,
    isScrolling,
    timer,
    lastPagePos,
    currPagePos,
    navRef,
    documentHeight,
  ]); // do this on route change

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

  var stars = useRef(generateStars(500));

  return (
    <>
      <Navbar getNavRef={getNavRef} />
      {isMobile === true ? null : <div className="space-bg"></div>}
      {stars.current}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isMobile={isMobile}
              getDocumentHeight={getDocumentHeight}
            />
          }
        />
        <Route
          path="/algorithm-visualizer"
          element={
            <VisualizerToolPage
              isMobile={isMobile}
              getDocumentHeight={getDocumentHeight}
            />
          }
        />
      </Routes>
    </>
  );
}
