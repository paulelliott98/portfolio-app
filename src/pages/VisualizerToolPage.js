import { React, useEffect } from "react";
import Stars from "../components/Stars";
import AlgorithmVisualizer from "../components/algorithm-visualizer/algoVisualizer";
import "../styles.css";
// const utils = require("../utils");

export default function VisualizerToolPage() {
  const maxSize = 525;

  useEffect(() => {
    console.log("VisualizerToolPage");
  }, []);

  return (
    <div className="">
      <div className="space-bg"></div>
      <Stars />
      <section key="0" className="scroll-window-full" id="home">
        <div className="nav-fill"></div>
        <div className="mt-28 flex justify-center">
          <AlgorithmVisualizer w={maxSize} h={maxSize} />
        </div>
      </section>
    </div>
  );
}
