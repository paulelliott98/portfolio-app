import React from "react";
import { Link } from "react-scroll";

// navbar component
export default function Navbar() {
  return (
    <>
      <div className={"nav-area "}>
        <div className="navbar ">
          <Link
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
