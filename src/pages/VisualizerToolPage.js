import { React } from "react";
import AlgorithmVisualizer from "../components/algorithm-visualizer/algoVisualizer";
import "../styles.css";

export default function VisualizerToolPage(props) {
  const maxSize = 580;

  return props.isMobile ? (
    <section className="h-full">
      <div className="flex mx-10 text-center justify-center items-center h-screen">
        <div>
          This feature is not available on touch devices and small screens
        </div>
      </div>
    </section>
  ) : (
    <section className="scroll-window">
      <div className="nav-fill"></div>
      <AlgorithmVisualizer w={maxSize} h={maxSize} />
    </section>
  );
}
