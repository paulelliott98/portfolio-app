import { React, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";

// navbar component
export default function Navbar(props) {
  let navRef = useRef(null);

  useEffect(() => {
    props.getNavRef(navRef.current);
  }, [props]);

  return (
    <div ref={navRef} className="nav-area ">
      <div className="navbar ">
        <RouterLink to="/" draggable={false}>
          home
        </RouterLink>
        <div className="nav-item">
          <RouterLink to="/#projects" draggable={false}>
            projects
          </RouterLink>
          <span className="arrow"></span>
          <ul className="dropdown">
            <RouterLink to="/algorithm-visualizer" draggable={false}>
              Algo Visualizer
            </RouterLink>
          </ul>
        </div>
        <RouterLink to="/#about" draggable={false}>
          about
        </RouterLink>
        <RouterLink to="/#contact" draggable={false}>
          contact
        </RouterLink>
      </div>
    </div>
  );
}
