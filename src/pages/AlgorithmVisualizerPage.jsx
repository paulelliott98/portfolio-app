import { React, useEffect } from 'react';
import SearchVisualizer from '../components/SearchVisualizer/SearchVisualizer';
import '../styles.css';
import { Typography } from '@mui/material';
import SortingVisualizer from '../components/SortingVisualizer/SortingVisualizer';

const utils = require('../utils');

export default function AlgorithmVisualizerPage(props) {
  const maxSize = 580;
  const getDocumentHeight = props.getDocumentHeight;

  useEffect(() => {
    getDocumentHeight(utils.getPageHeight(document));
  }, [getDocumentHeight]);

  const components = {
    search: <SearchVisualizer w={maxSize} h={maxSize} />,
    sorting: <SortingVisualizer />,
  };

  return (
    <section
      className="scroll-window-full"
      style={{ paddingTop: '0', display: 'flex', justifyContent: 'center' }}
    >
      {props.isMobile ? (
        <div className="flex mx-10 text-center justify-center items-center h-screen">
          <Typography variant="body1">
            This feature is not available on touch devices and small screens
          </Typography>
        </div>
      ) : (
        components[props.render]
      )}
    </section>
  );
}
