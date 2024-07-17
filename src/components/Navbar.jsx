import { React, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { default as AppRoutes } from '../Routes';

// navbar component
export default function Navbar({ getNavRef }) {
  const navRef = useRef(null);
  //   const location = useLocation();

  const closeDropdown = () => {
    const focusedElement =
      document.getElementById('navbar-dropdown').querySelector(':focus') ||
      document.getElementById('navbar-dropdown');
    if (!focusedElement) return;

    focusedElement.blur();
  };

  useEffect(() => {
    getNavRef(navRef.current);
  }, [getNavRef]);

  return (
    <div ref={navRef} className="nav-area" id="nav">
      <div className="navbar">
        <RouterLink
          to="/"
          draggable={false}
          onClick={() => {
            document.documentElement.scrollTo(0, 0);
          }}
        >
          home
        </RouterLink>
        <div className="nav-item">
          <RouterLink
            to="/#projects"
            draggable={false}
            onClick={() => {
              document.getElementById('projects')?.scrollIntoView();
              closeDropdown();
            }}
          >
            projects
          </RouterLink>
          <span className="arrow"></span>
          <ul className="navbar-dropdown" id="navbar-dropdown">
            <RouterLink
              to={AppRoutes.sortingVisualizer}
              onClick={closeDropdown}
              draggable={false}
            >
              Sorting Algo Sandbox
            </RouterLink>
            <RouterLink
              to={AppRoutes.searchVisualizer}
              onClick={closeDropdown}
              draggable={false}
            >
              Search Algo Sandbox
            </RouterLink>
            <RouterLink
              to={AppRoutes.snake}
              onClick={closeDropdown}
              draggable={false}
            >
              Snake
            </RouterLink>
          </ul>
        </div>
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
