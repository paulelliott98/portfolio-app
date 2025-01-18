import { React, useEffect, useRef, useState } from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
import { default as AppRoutes } from '../Routes';
import { Grid, List, ListItemButton, ListSubheader } from '@mui/material';

// navbar component
export default function Navbar({ getNavRef }) {
  const navRef = useRef(null);
  const navbarDropdownContainerRef = useRef(null);

  const toggleDropdown = () => {
    if (!navbarDropdownContainerRef.current) return;
    if (navbarDropdownContainerRef.current.style.visibility === 'hidden') {
      navbarDropdownContainerRef.current.style.opacity = 1;
      navbarDropdownContainerRef.current.style.visibility = 'visible';
    } else {
      navbarDropdownContainerRef.current.style.opacity = 0;
      navbarDropdownContainerRef.current.style.visibility = 'hidden';
    }
  };

  const closeDropdown = () => {
    if (!navbarDropdownContainerRef.current) return;
    navbarDropdownContainerRef.current.style.opacity = 0;
    navbarDropdownContainerRef.current.style.visibility = 'hidden';
  };

  const openDropdown = () => {
    if (!navbarDropdownContainerRef.current) return;
    navbarDropdownContainerRef.current.style.opacity = 1;
    navbarDropdownContainerRef.current.style.visibility = 'visible';
  };

  useEffect(() => {
    getNavRef(navRef.current);
  }, [getNavRef]);

  const projectsRef = useRef(null); // projects link in navbar
  const [navItemData, setNavItemData] = useState({
    projects: {
      left: 0,
      width: 0,
    },
  });
  useEffect(() => {
    const updateNavItemData = () => {
      if (projectsRef.current) {
        setNavItemData({
          ...navItemData,
          projects: {
            left: projectsRef.current.getBoundingClientRect().left,
            width: projectsRef.current.getBoundingClientRect().width,
          },
        });
      }
    };

    // Call initially to set the state on mount
    document.fonts.ready.then(updateNavItemData);

    // Add event listener for window resize
    window.addEventListener('resize', updateNavItemData);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', updateNavItemData);
  }, []); //eslint-disable-line

  return (
    <>
      <div ref={navRef} className='nav-area' id='nav'>
        <div className='navbar'>
          <RouterLink
            to='/'
            draggable={false}
            onClick={() => {
              closeDropdown();
              document.documentElement.scrollTo(0, 0);
            }}
          >
            home
          </RouterLink>
          <div
            className='nav-item'
            id='nav-item-projects'
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
            ref={projectsRef}
          >
            <RouterLink
              to='/#projects'
              draggable={false}
              onClick={() => {
                toggleDropdown();
                document.getElementById('projects')?.scrollIntoView();
              }}
            >
              <span>projects</span>
              <span className='arrow'></span>
            </RouterLink>
          </div>
          <RouterLink
            to='/#about'
            draggable={false}
            onClick={() => {
              closeDropdown();
              document.getElementById('about')?.scrollIntoView();
            }}
          >
            about
          </RouterLink>
          <RouterLink
            to='/#contact'
            draggable={false}
            onClick={() => {
              closeDropdown();
              document.getElementById('contact')?.scrollIntoView();
            }}
          >
            contact
          </RouterLink>
        </div>
      </div>
      {/* Navbar Dropdown */}
      <Grid
        container
        className='navbar-dropdown-container'
        id='navbar-dropdown-container'
        ref={navbarDropdownContainerRef}
        onClick={closeDropdown}
      >
        <Grid
          id='projects-dropdown'
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
          sx={{
            position: 'fixed',
            left: navItemData.projects.left,
            width: navItemData.projects.width,
          }}
        >
          <List>
            <ListSubheader>Sandboxes</ListSubheader>
            <ListItemButton
              component={Link}
              to={AppRoutes.sortingVisualizer}
              onClick={closeDropdown}
            >
              Sorting
            </ListItemButton>
            <ListItemButton
              component={Link}
              to={AppRoutes.searchVisualizer}
              onClick={closeDropdown}
            >
              Search
            </ListItemButton>
          </List>
          <List>
            <ListSubheader>Games</ListSubheader>
            <ListItemButton
              component={Link}
              to={AppRoutes.snake}
              onClick={closeDropdown}
            >
              Snake
            </ListItemButton>
          </List>
        </Grid>
      </Grid>
    </>
  );
}
