import React, { useState } from "react";
import "./styles.css";
import Project from "./Project";
import Navbar from "./Navbar";
import Snake from "./Snake";
import FlipCard from "./FlipCard";
import { CSSTransition } from "react-transition-group";
import { useInView } from "react-intersection-observer";
import "animate.css";

export default function HomePage() {
  const projects = [
    {
      id: 0,
      listName: "polygon detection",
      name: "Canvas with Polygon Detection",
      codingLang: "python",
      dx: [
        "As part of an effort to create pigeon art in Dr. Blaisdell’s lab at UCLA, this project showcases an implementation of the algorithm for extracting the regions of a planar graph described in a ",
        <a
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.sciencedirect.com/science/article/abs/pii/016786559390104L"
        >
          paper
        </a>,
        " by  X.Y. Jiang and H. Bunke (1993). By drawing intersecting line segments on the canvas, users can see the algorithm in action as polygons are filled in with various colors.",
      ],
      gitUrl: "https://github.com/paulgan98/polygon-detection",
    },
    {
      id: 1,
      listName: "prime spiral visualizer",
      name: "Prime Spiral Visualizer",
      codingLang: "javascript",
      dx: [
        "HTML canvas with drag scrolling and zoom for visualizing the beautiful and enigmatic patterns in the prime spiral. Made with ReactJS.",
        "\n",
        " Check it out ",
        <a
          className="link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://paulgan98.github.io/prime-spiral/"
        >
          here
        </a>,
        "!",
      ],
      gitUrl: "https://github.com/paulgan98/prime-spiral",
    },
    {
      id: 2,
      listName: "connect four",
      name: "Connect Four",
      codingLang: "python",
      dx:
        "A console game with AI opponent implementing the minimax algorithm with alpha-beta pruning. Drawn with text and runs on the MacOS terminal.",
      gitUrl: "https://github.com/paulgan98/connect4",
    },
    {
      id: 3,
      listName: "snake",
      name: "Snake",
      codingLang: "c++",
      dx:
        "The classic game of snake, drawn entirely with text for the MacOS and Windows terminal. The player maneuvers the snake's head using arrow keys to eat fruits that spawn randomly around the arena. The snake's body grows longer as it eats.",
      gitUrl: "https://github.com/paulgan98/snake",
    },
  ];

  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [ref, inView] = useInView(); // intro
  const [ref2, inView2] = useInView(); // projects
  const [ref3, inView3] = useInView(); // about bio
  const [ref4, inView4] = useInView(); // about languages and things I love
  const [ref5, inView5] = useInView(); // contact

  // animations
  const anim = (type, view) => {
    var animIn = "";
    var animOut = "";
    switch (type) {
      case "slideLeft":
        animIn = "animate__fadeInLeft animate__fast";
        animOut = "animate__fadeOutLeft animate__fast";
        break;

      case "slideRight":
        animIn = "animate__fadeInRight animate__faster";
        animOut = "animate__fadeOutRight animate__faster";
        break;

      case "slideUp":
        animIn = "animate__fadeInUp animate__faster";
        animOut = "animate__fadeOutUp animate__faster";
        break;

      case "slideDown":
        animIn = "animate__fadeInDown animate__fast";
        // animOut = "animate__fadeOutDown animate__fast";
        break;

      case "fade":
        animIn = "animate__fadeIn animate__fast";
        animOut = "animate__fadeOut animate__fast";
        break;

      case "flipX":
        animIn = "animate__flipInX";
        animOut = "animate__flipOutX";
        break;

      case "flipY":
        animIn = "animate__flipInY";
        animOut = "animate__flipOutY";
        break;

      default:
        break;
    }

    return view
      ? `animate__animated ${animIn}`
      : `animate__animated ${animOut}`;
  };

  // add animation delay in style
  const animDelay = (delay) => {
    const style = {
      animationDelay: `${delay}s`,
    };
    return style;
  };

  const handleDisplay = (e, i) => {
    e.preventDefault();
    if (active !== i) {
      setAnimate(!animate);
      setActive(i);
    }
  };

  return (
    <div className="prevent-select">
      <Navbar />
      <div>
        <section className="scroll-window-home" id="home">
          <div className="nav-fill"></div>

          <div className="flex justify-between self-center">
            <div className="intro mt-40">
              <div ref={ref}></div>
              <h5 className={anim("slideUp", inView)} style={animDelay(0)}>
                Hi, my name is
              </h5>
              <h1 className={anim("slideUp", inView)} style={animDelay(0.2)}>
                Paul Gan
              </h1>
              <h5 className={anim("slideUp", inView)} style={animDelay(0.4)}>
                I am a software engineer and self-taught web developer who
                transforms great ideas into remarkable digital experiences.
              </h5>
              {/* <br></br>
              <h5 className={anim("slideUp", inView)} style={animDelay(0.6)}>
                Come check out some of my work!
              </h5> */}
            </div>
            <div className={"mt-28 snake " + anim("fade", inView)}>
              <Snake w={282} h={282} />
              {/* <Snake w={300} h={25} /> */}
            </div>
          </div>
        </section>

        <section className="scroll-window" id="projects">
          <div className="section-title">
            <h4>projects</h4>
          </div>
          <div ref={ref2}></div>
          <div className="flex justify-between">
            <div className="projects-list">
              {projects.map((p) => (
                <a
                  className={anim("slideLeft", inView2)}
                  style={{
                    ...{
                      backgroundColor:
                        active === p.id ? "var(--bg-color-2)" : "",
                      color: active === p.id ? "var(--text-color-main)" : "",
                      borderLeft:
                        active === p.id
                          ? "2px solid var(--heading-color-main)"
                          : "",
                    },
                    ...animDelay(0.3 + p.id * 0.1),
                  }}
                  href="/#"
                  rel="noopener noreferrer"
                  onClick={(e) => handleDisplay(e, p.id)}
                >
                  <div>
                    <span>{p.listName}</span>
                  </div>
                </a>
              ))}
            </div>
            <div
              className={"project-container " + anim("fade", inView2)}
              style={animDelay(0.8)}
            >
              {projects
                .filter((p) => {
                  return p.id === active;
                })
                .map((p) => (
                  <CSSTransition in={animate} timeout={400} classNames="fade">
                    <Project
                      codingLang={p.codingLang}
                      name={p.name}
                      dx={p.dx}
                      gitUrl={p.gitUrl}
                    />
                  </CSSTransition>
                ))}
            </div>
          </div>
        </section>

        <section className="scroll-window" id="about">
          <div className="section-title">
            <h4>about</h4>
          </div>
          <div ref={ref3} className="flex">
            <div
              className={"container " + anim("fade", inView3)}
              style={animDelay(0.5)}
            >
              <h2>Bio</h2>
              <div className="divider"></div>
              <p>
                Hello and welcome to my website! I am a motivated graduate of
                UCLA’s class of 2022 (Go Bruins!) with a major in molecular,
                cell, and development biology and a minor in bioinformatics.
              </p>
              <p>
                Previously pre-dental, I eventually made up my mind to pursue my
                passion for coding and switched into tech during my 4th year of
                college.
              </p>
              <p>
                Over the years, I’ve explored and completed personal projects in
                many areas including:
              </p>
              <ul>
                <li key="0">Object Detection— Tensorflow</li>
                <li key="1">Pytorch Data Science— Scikit-learn, Pandas</li>
                <li key="2">
                  Web Scraping and Automation— Selenium, BeautifulSoup
                </li>
                <li key="3">Web Development— ReactJS, HubSpot CMS</li>
                <li key="4">Game Development— Pygame, JavaScript</li>
              </ul>
              <p>
                I am currently working my very first job as an associate
                software engineer at Nisum.
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div
              ref={ref4}
              className={"container max-w-49 " + anim("fade", inView4)}
              style={animDelay(0.5)}
            >
              <h2>programming languages</h2>
              <div className="divider"></div>
              <ul>
                <li key="0">python</li>
                <li key="1">java</li>
                <li key="2">c++</li>
                <li key="3">javascript</li>
              </ul>
            </div>
            <div
              className={"container max-w-49 " + anim("fade", inView4)}
              style={animDelay(0.7)}
            >
              <h2>things I love</h2>
              <div className="divider"></div>
              <ul>
                <li key="0">rainy days</li>
                <li key="1">snow</li>
                <li key="2">working out</li>
                <li key="3">Harry Potter, Marvel, Star Wars</li>
                <li key="4">video games</li>
                <li key="5">listening to music and podcasts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <section className="scroll-window" id="contact">
        <div className="section-title">
          <h4>get in touch</h4>
        </div>
        <div className="flex justify-center">
          <div ref={ref5}></div>
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.2)}
            href="https://github.com/paulgan98"
            title="github"
            path={require("./images/github-mark-white.png")}
            alt="github logo"
          />
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.4)}
            href="https://www.linkedin.com/in/paul-gan-85781b18b/"
            title="linkedin"
            path={require("./images/linkedin-logo.png")}
            alt="linkedin logo"
          />
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.6)}
            href="https://www.instagram.com/paulypavilion/"
            title="instagram"
            path={require("./images/instagram-logo.png")}
            alt="instagram logo"
          />
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.8)}
            href="mailto:paulgan98@gmail.com"
            title="email"
            path={require("./images/email-logo.png")}
            alt="email logo"
          />
        </div>
      </section>
      <footer className="footer">
        <div>
          <span>A React App designed and built by Paul Gan</span>
        </div>
      </footer>
    </div>
  );
}
