import { React, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { default as AppRoutes } from '../Routes';

// navbar component
export default function Navbar({ getNavRef }) {
  let navRef = useRef(null);
  const location = useLocation();

  const closeDropdown = () => {
    const focusedElement = document
      .getElementById('navbar-dropdown')
      .querySelector(':focus');
    focusedElement.blur();
  };

  useEffect(() => {
    getNavRef(navRef.current);
  }, [getNavRef]);

  return (
    <div ref={navRef} className="nav-area">
      <div className="navbar">
        <RouterLink
          to="/"
          draggable={false}
          onClick={() => window.scrollTo(0, 0)}
        >
          home
        </RouterLink>
        <div className="nav-item">
          <RouterLink to={location.pathname} draggable={false}>
            visualize
          </RouterLink>
          <span className="arrow"></span>
          <ul className="navbar-dropdown" id="navbar-dropdown">
            <RouterLink
              to={AppRoutes.searchVisualizer}
              onClick={closeDropdown}
              draggable={false}
            >
              Search Algorithms
            </RouterLink>
            <RouterLink
              to={AppRoutes.sortingVisualizer}
              onClick={closeDropdown}
              draggable={false}
            >
              Sorting Algorithms
            </RouterLink>
          </ul>
        </div>
        <RouterLink
          to="/#projects"
          draggable={false}
          onClick={() => document.getElementById('projects')?.scrollIntoView()}
        >
          projects
        </RouterLink>
        <RouterLink
          to="/#about"
          draggable={false}
          onClick={() => document.getElementById('about')?.scrollIntoView()}
        >
          about
        </RouterLink>
        <RouterLink
          to="/#contact"
          draggable={false}
          onClick={() => document.getElementById('contact')?.scrollIntoView()}
        >
          contact
        </RouterLink>
      </div>
    </div>
  );
}
