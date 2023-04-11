import HomePage from "./pages/HomePage";
import VisualizerToolPage from "./pages/VisualizerToolPage";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function App() {
  let isEventListenersAttached = useRef(false);
  let isScrolling = useRef(false);
  let timer = useRef(null);

  const { pathname, hash, key } = useLocation();

  function handleScroll() {
    isScrolling.current = true;

    if (timer.current !== null) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      isScrolling.current = false; // user stopped scrolling
    }, 50);
  }

  useEffect(() => {
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

    if (!isEventListenersAttached.current)
      window.addEventListener("scroll", handleScroll);
    isEventListenersAttached.current = true;

    return () => {
      clearTimeout(to);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, hash, key, isScrolling, timer]); // do this on route change

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  const isMobile = width <= 992;

  return (
    <Routes>
      <Route path="/" element={<HomePage isMobile={isMobile} />} />
      <Route
        path="/algorithm-visualizer"
        element={<VisualizerToolPage isMobile={isMobile} />}
      />
    </Routes>
  );
}
