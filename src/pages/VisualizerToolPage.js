import { React } from "react";
import AlgorithmVisualizer from "../components/algorithm-visualizer/algoVisualizer";
import "../styles.css";

export default function VisualizerToolPage(props) {
  const maxSize = 580;

  return (
    <div className="prevent-select overflow-hidden">
      <section className="h-full">
        <div className="nav-fill"></div>
        {props.isMobile ? (
          <div className="flex justify-center items-center h-screen">
            <div>This feature is not yet available on touch devices.</div>
          </div>
        ) : (
          <AlgorithmVisualizer w={maxSize} h={maxSize} />
        )}
      </section>
    </div>
  );
}
