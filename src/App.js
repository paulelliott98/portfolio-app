import HomePage from "./pages/HomePage";
import VisualizerToolPage from "./pages/VisualizerToolPage";
import { Route, Routes } from "react-router-dom";
// import { useEffect } from "react";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/algorithm-visualizer" element={<VisualizerToolPage />} />
    </Routes>
  );
}
