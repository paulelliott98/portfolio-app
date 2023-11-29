import { React, useEffect } from 'react';
import SearchVisualizer from '../components/search-visualizer/SearchVisualizer';
import '../styles.css';

const utils = require('../utils');

export default function SearchVisualizerPage(props) {
  const maxSize = 580;
  const getDocumentHeight = props.getDocumentHeight;

  useEffect(() => {
    getDocumentHeight(utils.getPageHeight(document));
  }, [getDocumentHeight]);

  return (
    <section
      className="scroll-window-full"
      style={{ paddingTop: '0', display: 'flex', justifyContent: 'center' }}
    >
      {props.isMobile ? (
        <div className="flex mx-10 text-center justify-center items-center h-screen">
          <p>
            This feature is not available on touch devices and small screens
          </p>
        </div>
      ) : (
        <SearchVisualizer w={maxSize} h={maxSize} />
      )}
    </section>
  );
}
