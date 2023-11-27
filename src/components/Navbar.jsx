import { React, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
        <RouterLink to="/#projects" draggable={false}>
          projects
        </RouterLink>
        <div className="nav-item">
          <RouterLink to="#" draggable={false}>
            algo visualization
          </RouterLink>
          <span className="arrow"></span>
          <ul className="navbar-dropdown">
            <RouterLink to="/visualize/search" draggable={false}>
              Search
            </RouterLink>
            <RouterLink to="/visualize/sorting" draggable={false}>
              Sorting
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
