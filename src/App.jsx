import HomePage from './pages/HomePage';
import AlgorithmVisualizerPage from './pages/AlgorithmVisualizerPage';
import Navbar from './components/Navbar';

import { Route, Routes, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Grid, ThemeProvider } from '@mui/material';
import theme from './theme';
import { default as AppRoutes } from './Routes';
import Stars from './components/Background/Stars';
import SnakePage from './pages/SnakePage';

const utils = require('./utils');

var isMobile =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

export default function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const isSmallScreen = useRef(isMobile === true || width <= 992);

  const documentHeight = useRef(utils.getPageHeight(document));

  function getDocumentHeight(height) {
    documentHeight.current = height;
  }

  const navRef = useRef(null);

  const getNavRef = useCallback((ref) => {
    navRef.current = ref;
  }, []);

  useEffect(() => {
    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
      isSmallScreen.current = isMobile === true || width <= 992;
    }

    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [width]);

  let isScrolling = useRef(false);
  let isUserScrolling = useRef(false);
  let isTouchMove = useRef(false);

  let [lastPagePos, currPagePos] = [
    useRef(document.documentElement.scrollTop),
    useRef(document.documentElement.scrollTop),
  ];
  let timer = useRef(null);

  const { pathname, hash, key } = useLocation();

  // make nav area background fade to transparent when scrolling to top
  const setNavbarStyles = useCallback(() => {
    // const triggerHeight = 400;
    // const defaultBlur = 12;
    // const defaultBgOpacity = 0.05;
    // const defaultBorderOpacity = 0.08;

    if (currPagePos.current <= 0) {
      //   console.log('Hide background');
      //   navRef.current.style.animation = 'navbarIn 0.3s ease backwards';
      //   navRef.current.style.background = 'none';
      //   navRef.current.style.borderBottom = '1px solid #ffffff00';
      //   const scaleFactor = currPagePos.current / triggerHeight;
      //   const blurAmount = defaultBlur * scaleFactor;
      //   const backgroundOpacity = defaultBgOpacity * scaleFactor;
      //   const borderOpacity = defaultBorderOpacity * scaleFactor;
      //   navRef.current.style.backdropFilter = `blur(${blurAmount}px)`;
      //   navRef.current.style.background = `rgba(255, 255, 255, ${backgroundOpacity})`;
      //   navRef.current.style.borderBottom = `1px solid rgba(255, 255, 255, ${borderOpacity})`;
    } else {
      //   console.log('Show background');
      //   navRef.current.style.animation = 'navbarIn 0.3s ease forwards';
      //   navRef.current.style.background = '';
      //   navRef.current.style.borderBottom = `1px solid rgba(255, 255, 255, ${defaultBorderOpacity})`;
      //   navRef.current.style.backdropFilter = ``;
      //   navRef.current.style.background = ``;
      //   navRef.current.style.borderBottom = ``;
    }
  }, [currPagePos]);

  useEffect(() => {
    setNavbarStyles();
  }, [setNavbarStyles]);

  useEffect(() => {
    function handleWheel() {
      isUserScrolling.current = true;
    }

    function handleTouchMove() {
      isTouchMove.current = true;
    }

    document.addEventListener('wheel', handleWheel);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchmove', handleTouchMove);
      isUserScrolling.current = false;
      isTouchMove.current = false;
    };
  }, [pathname, key, timer, documentHeight]);

  useEffect(() => {
    function handleScroll() {
      isScrolling.current = true;

      lastPagePos.current = currPagePos.current;
      currPagePos.current = document.documentElement.scrollTop;

      // make nav area background fade to transparent when scrolling to top
      setNavbarStyles();

      if (timer.current !== null) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        isScrolling.current = false; // page stopped moving
      }, 50);
    }

    // scroll to element by id
    const id = hash.replace('#', '');
    document.getElementById(id)?.scrollIntoView();

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [hash, lastPagePos, currPagePos, setNavbarStyles]);

  return (
    <Grid
      item
      container
      style={{
        flexFlow: 'column nowrap',
        paddingBlockStart: getComputedStyle(document.body).getPropertyValue(
          '--nav-height'
        ),
      }}
    >
      <Stars />
      <ThemeProvider theme={theme}>
        <Navbar getNavRef={getNavRef} />

        <Routes>
          <Route
            path={AppRoutes.homePage}
            element={
              <HomePage
                isSmallScreen={isSmallScreen.current}
                getDocumentHeight={getDocumentHeight}
              />
            }
          />
          <Route
            path={AppRoutes.searchVisualizer}
            element={
              <AlgorithmVisualizerPage
                isMobile={isSmallScreen.current}
                getDocumentHeight={getDocumentHeight}
                render='search'
              />
            }
          />
          <Route
            path={AppRoutes.sortingVisualizer}
            element={
              <AlgorithmVisualizerPage
                isMobile={isSmallScreen.current}
                getDocumentHeight={getDocumentHeight}
                render='sorting'
              />
            }
          />
          <Route
            path={AppRoutes.snake}
            element={<SnakePage isSmallScreen={isSmallScreen.current} />}
          />
        </Routes>
      </ThemeProvider>
    </Grid>
  );
}
