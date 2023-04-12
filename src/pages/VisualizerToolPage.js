import { React } from "react";
import AlgorithmVisualizer from "../components/algorithm-visualizer/algoVisualizer";
import "../styles.css";

export default function VisualizerToolPage(props) {
  const maxSize = 580;

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
          <AlgorithmVisualizer w={maxSize} h={maxSize} />
        </>
      )}
    </section>
  );
}
