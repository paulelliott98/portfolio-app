import React from "react";
import { Link } from "react-scroll";

// reuseable component for projects
export default function Navbar() {
  return (
    <>
      <div className={"nav-area "}>
        <div className={"navbar "}>
          <Link
            key="0"
            href="#"
            draggable="false"
            to="home"
            spy={true}
            smooth={true}
            duration={0}
          >
            home
          </Link>

          <Link
            key="1"
            href="#"
            draggable="false"
            to="projects"
            spy={true}
            smooth={true}
            duration={0}
          >
            projects
          </Link>

          <Link
            key="2"
            href="#"
            draggable="false"
            to="about"
            spy={true}
            smooth={true}
            duration={0}
          >
            about
          </Link>

          <Link
            key="3"
            href="#"
            draggable="false"
            to="contact"
            spy={true}
            smooth={true}
            duration={0}
          >
            contact
          </Link>
        </div>
      </div>
    </>
  );
}
