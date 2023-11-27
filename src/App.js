import HomePage from './pages/HomePage';
import SearchVisualizerPage from './pages/SearchVisualizerPage';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { default as AppRoutes } from './Routes';
import SortingVisualizer from './components/sorting-visualizer/SortingVisualizer';

const utils = require('./utils');

var isMobile =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

export default function App() {
  const [width, setWidth] = useState(window.innerWidth);
  let isSmallScreen = useRef(isMobile === true || width <= 992);

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
    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
      isSmallScreen.current = isMobile === true || width <= 992;
    }

    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  });

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
          if (
            (isUserScrolling.current === true ||
              isSmallScreen.current === true) &&
            documentHeight.current > window.screen.height
          ) {
            navRef.current.style.visibility = 'hidden';

            const dy = `-${navRef.current.clientHeight + 3}px`;
            navRef.current.style.transform = `translateY(${dy})`;
          }
        } else {
          // console.log("Scrolling up");
          navRef.current.style = ''; // set to default defined css style
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
      if (hash === '') {
        window.scrollTo(0, 0);
      }
      // else scroll to id
      else {
        to = setTimeout(() => {
          const id = hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView();
          }
        }, 0);
      }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchmove', handleTouchMove);

    isUserScrolling.current = false;
    isTouchMove.current = false;

    return () => {
      clearTimeout(to);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
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

  let [stars, setStars] = useState(null);

  useEffect(() => {
    // create 3 layers of sliding backgrounds, where each layer has one size of stars
    // layers with smaller stars will move faster (shorter duration) to create the parallax effect
    function generateStars(n) {
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
          position: 'fixed',
          zIndex: `-${500 - size}`,
          left: `0`,
          top: `0`,
          width: `${size}px`,
          height: `${size}px`,
          background: `transparent`,
          borderRadius: `50% 50%`,
          animation: `animStar ${Math.pow(size, 0.5) * 200}s linear infinite`,
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
    }

    setStars(generateStars(130));
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar getNavRef={getNavRef} />
        {isSmallScreen.current === true ? null : (
          <div className="space-bg"></div>
        )}
        {stars}

        <Routes>
          <Route
            path={AppRoutes.homePage}
            element={
              <HomePage
                isMobile={isSmallScreen.current}
                getDocumentHeight={getDocumentHeight}
              />
            }
          />
          <Route
            path={AppRoutes.searchVisualizer}
            element={
              <SearchVisualizerPage
                isMobile={isSmallScreen.current}
                getDocumentHeight={getDocumentHeight}
              />
            }
          />
          <Route
            path={AppRoutes.sortingVisualizer}
            element={<SortingVisualizer />}
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}
