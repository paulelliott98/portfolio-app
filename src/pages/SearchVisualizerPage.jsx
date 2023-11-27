import { React, useEffect } from 'react';
import SearchVisualizer from '../components/algorithm-visualizer/SearchVisualizer';
import '../styles.css';

const utils = require('../utils');

export default function SearchVisualizerPage(props) {
  const maxSize = 580;
  const getDocumentHeight = props.getDocumentHeight;

  useEffect(() => {
    getDocumentHeight(utils.getPageHeight(document));
  }, [getDocumentHeight]);

  return (
    <section className="scroll-window">
      {props.isMobile ? (
        <div className="flex mx-10 text-center justify-center items-center h-screen">
          <p>
            This feature is not available on touch devices and small screens
          </p>
        </div>
      ) : (
        <>
          <div className="nav-fill"></div>
          <SearchVisualizer w={maxSize} h={maxSize} />
        </>
      )}
    </section>
  );
}
