import { React, useCallback, useEffect } from 'react';
import SearchVisualizer from '../components/SearchVisualizer/SearchVisualizer';
import '../styles.css';
import SortingVisualizer from '../components/SortingVisualizer/SortingVisualizer';
import ComponentDisabled from '../components/ComponentDisabled';

const utils = require('../utils');

export default function AlgorithmVisualizerPage({
  render,
  getDocumentHeight,
  isMobile,
}) {
  useEffect(() => {
    getDocumentHeight(utils.getPageHeight(document));
  }, [getDocumentHeight]);

  const renderComponent = useCallback(() => {
    if (render === 'search') {
      return <SearchVisualizer />;
    }
    return <SortingVisualizer />;
  }, [render]);

  return (
    <>
      <section className="section-fixed">
        {isMobile ? <ComponentDisabled /> : renderComponent()}
      </section>
    </>
  );
}
