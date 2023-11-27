import { React, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { default as AppRoutes } from '../Routes';

// navbar component
export default function Navbar(props) {
  let navRef = useRef(null);

  useEffect(() => {
    props.getNavRef(navRef.current);
  }, [props]);

  return (
    <div ref={navRef} className="nav-area">
      <div className="navbar">
        <RouterLink to="/" draggable={false}>
          home
        </RouterLink>
        <div className="nav-item">
          <RouterLink to="#" draggable={false}>
            visualize
          </RouterLink>
          <span className="arrow"></span>
          <ul className="navbar-dropdown">
            <RouterLink to={AppRoutes.searchVisualizer} draggable={false}>
              Search
            </RouterLink>
            {/* <RouterLink to={AppRoutes.sortingVisualizer} draggable={false}>
              Sorting
            </RouterLink> */}
          </ul>
        </div>
        <RouterLink to="/#projects" draggable={false}>
          projects
        </RouterLink>
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
