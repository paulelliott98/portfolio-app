import React from "react";
import { Link } from "react-scroll";

// reuseable component for projects
export default function Navbar() {
  return (
    <>
      <div class="nav-area">
        <div class="navbar">
          <Link href="#" to="home" spy={true} smooth={true} duration={0}>
            home
          </Link>

          <Link href="#" to="projects" spy={true} smooth={true} duration={0}>
            projects
          </Link>

          <Link href="#" to="about" spy={true} smooth={true} duration={0}>
            about
          </Link>

          <Link href="#" to="contact" spy={true} smooth={true} duration={0}>
            contact
          </Link>
        </div>
      </div>
    </>
  );
}
