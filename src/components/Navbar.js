import React from "react";
import { Link as RouterLink } from "react-router-dom";

// navbar component
export default function Navbar() {
  return (
    <>
      <div className={"nav-area "}>
        <div className="navbar ">
          <RouterLink to="/">home</RouterLink>
          <div className="nav-item">
            <RouterLink to="/#projects">
              projects<span class="arrow"></span>
            </RouterLink>
            <ul class="dropdown">
              <RouterLink to="/algorithm-visualizer">
                Search Algo Visualizer
              </RouterLink>
            </ul>
          </div>
          <RouterLink to="/#about">about</RouterLink>
          <RouterLink to="/#contact">contact</RouterLink>
        </div>
      </div>
    </>
  );
}
