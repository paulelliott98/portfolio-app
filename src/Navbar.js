import React from "react";
import { Link } from "react-scroll";

// reuseable component for projects
export default function Navbar() {
  // const [onAutoScroll, setOnAutoScroll] = useState(false);
  // const [lastScrollTime, setLastScrollTime] = useState(new Date());
  // const [currTime, setCurrTime] = useState(new Date());
  // const [currScrollPos, setCurrScrollPos] = useState(0);
  // const [prevScrollPos, setPrevScrollPos] = useState(0);
  // const [navClass, setNavClass] = useState("");

  const activateAutoScroll = () => {
    // setOnAutoScroll(true);
    // const now = new Date();
    // setLastScrollTime(now);
    // setCurrTime(now);
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     // if (onAutoScroll) {
  //     //   // setLastScrollTime(currTime);
  //     //   setPrevScrollPos(currScrollPos);
  //     //   return;
  //     // }
  //     setCurrScrollPos(window.pageYOffset);
  //     if (currScrollPos > prevScrollPos && !onAutoScroll) {
  //       // scroll up- hide navbar
  //       setNavClass("animate__animated animate__fadeOut animate__faster");
  //     } else if (currScrollPos < prevScrollPos && !onAutoScroll) {
  //       // scroll down- show navbar
  //       setNavClass("animate__animated animate__fadeIn animate__faster");
  //     }

  //     if (currScrollPos !== prevScrollPos) {
  //       setLastScrollTime(new Date());
  //     }

  //     setPrevScrollPos(currScrollPos);
  //   };

  //   handleScroll();

  //   setCurrTime(new Date());

  //   if (currTime - lastScrollTime > 10) {
  //     setOnAutoScroll(false);
  //   } else {
  //     setOnAutoScroll(true);
  //   }
  // }, [
  //   prevScrollPos,
  //   currScrollPos,
  //   onAutoScroll,
  //   lastScrollTime,
  //   currTime,
  //   navClass,
  // ]);

  return (
    <>
      <div class={"nav-area "}>
        <div class={"navbar "}>
          <Link
            onClick={activateAutoScroll}
            href="#"
            to="home"
            spy={true}
            smooth={true}
            duration={0}
          >
            home
          </Link>

          <Link
            onClick={activateAutoScroll}
            href="#"
            to="projects"
            spy={true}
            smooth={true}
            duration={0}
          >
            projects
          </Link>

          <Link
            onClick={activateAutoScroll}
            href="#"
            to="about"
            spy={true}
            smooth={true}
            duration={0}
          >
            about
          </Link>

          <Link
            onClick={activateAutoScroll}
            href="#"
            to="contact"
            spy={true}
            smooth={true}
            duration={0}
          >
            contact
          </Link>
        </div>
      </div>

      {/* <div class="fixed pt-32">
        <h2 class="">{onAutoScroll ? "true" : "false"}</h2>
        <h2 class="">{`${lastScrollTime}`}</h2>
        <h2 class="">{`${currTime}`}</h2>
      </div> */}
    </>
  );
}
