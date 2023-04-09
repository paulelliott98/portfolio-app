import React, { useState } from "react";
import "../styles.css";
import Project from "../components/Project";
import Navbar from "../components/Navbar";
import Snake from "../components/Snake";
import FlipCard from "../components/FlipCard";
import { CSSTransition } from "react-transition-group";
import { useInView } from "react-intersection-observer";
import "animate.css";

export default function HomePage() {
  const projects = [
    {
      listName: "snake",
      name: "Snake",
      techStack: [
        "Javascript",
        "React",
        "Axios",
        "Express",
        "Sequelize",
        "PostgreSQL",
        "Docker",
        "Jenkins",
      ],
      dx:
        "A full-stack JavaScript snake game that utilizes HTML canvas and interpolation to create fluid movement. In addition, the game has a leaderboard that displays the top 10 players' high scores. The scores are stored in and retrieved from a PostgreSQL database, allowing players to compete with each other for the top spot. ",
      gitUrl: "",
    },
    {
      listName: "polygon detection",
      name: "Canvas with Polygon Detection",
      techStack: ["Python", "Tkinter"],
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
        " by  X.Y. Jiang and H. Bunke (1993). Polygons are filled in with various colors as intersecting line segments are drawn onto the canvas.",
      ],
      gitUrl: "https://github.com/paulgan98/polygon-detection",
    },
    {
      listName: "browser game bot",
      name: "Browser Game Bot",
      techStack: ["Python", "Pandas", "Pytesseract", "OpenCV", "Selenium"],
      dx:
        "A program that automatically performs clicks or key inputs in game between set time intervals. It is able to solve captcha challenges by cleaning up noise and then converting text in the captcha image into string format using Pytesseract. This was my first project using Selenium and Chromedriver and my first time working with web elements. I will not be sharing the code to avoid disclosing any details about the game.",
      gitUrl: "",
    },
    {
      listName: "interactive prime spiral",
      name: "Interactive Prime Spiral",
      techStack: ["Javascript", "React"],
      dx: [
        "The prime or Ulam spiral is a visual depiction of prime numbers on an integer number line drawn in a square spiral shape, where every prime integer is marked with a dot. I implemented a HTML canvas with pan and zoom to help visualize the beautiful and enigmatic patterns in the spiral.",
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
      listName: "connect four",
      name: "Connect Four",
      techStack: ["Python"],
      dx:
        "A console game with AI opponent implementing the minimax algorithm with alpha-beta pruning. While not completely unbeatable, the AI is capable of putting up a very good fight. The game is entirely rendered with text and made for the MacOS terminal.",
      gitUrl: "https://github.com/paulgan98/connect4",
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
        animIn = "animate__animated animate__fadeInLeft animate__fast";
        animOut = "animate__animated animate__fadeOutLeft animate__fast";
        break;
      case "slideRight":
        animIn = "animate__animated animate__fadeInRight animate__faster";
        animOut = "animate__animated animate__fadeOutRight animate__faster";
        break;
      case "slideUp":
        animIn = "animate__animated animate__fadeInUp animate__fast";
        animOut = "animate__animated animate__fadeOutUp animate__fast";
        break;
      case "slideDown":
        animIn = "animate__animated animate__fadeInDown animate__fast";
        animOut = "animate__animated animate__fadeOutDown animate__fast";
        break;
      case "fade":
        animIn = "fadeIn";
        animOut = "fadeOut";
        break;
      default:
        break;
    }

    return view ? `${animIn}` : `${animOut}`;
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
        <section className="scroll-window-full" id="home">
          <div className="nav-fill"></div>

          <div className="flex justify-between self-center">
            <div ref={ref} className="intro mt-40">
              <h5 className={anim("slideUp", inView)} style={animDelay(0)}>
                Hi, my name is
              </h5>
              <h1 className={anim("slideUp", inView)} style={animDelay(0.3)}>
                Paul Gan
              </h1>
              <h5 className={anim("slideUp", inView)} style={animDelay(0.6)}>
                I am a software engineer and web developer who transforms great
                ideas into remarkable digital experiences.
              </h5>
            </div>
            <div className={"mt-24 snake " + anim("fade", inView)}>
              <Snake w={362} h={362} />
              {/* <Snake w={300} h={25} /> */}
            </div>
          </div>
        </section>

        <section className="scroll-window-full" id="projects">
          <div className="section-title">
            <h4>projects</h4>
          </div>
          <div ref={ref2} className="flex justify-between">
            <div className="projects-list">
              {projects.map((p, index) => (
                <a
                  className={anim("slideLeft", inView2)}
                  style={{
                    ...{
                      backgroundColor:
                        active === index ? "var(--bg-color-2)" : "",
                      color: active === index ? "var(--text-color-main)" : "",
                      borderLeft:
                        active === index
                          ? "2px solid var(--heading-color-main)"
                          : "",
                    },
                    ...animDelay(0.3 + index * 0.1),
                  }}
                  href="/#"
                  rel="noopener noreferrer"
                  onClick={(e) => handleDisplay(e, index)}
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
                .filter((_, index) => {
                  return index === active;
                })
                .map((p) => (
                  <CSSTransition in={animate} timeout={400} classNames="fade">
                    <Project
                      techStack={p.techStack}
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
                Hello and welcome to my website! I am a graduate of UCLA’s class
                of 2022 (Go Bruins!) with a major in molecular, cell, and
                development biology and a minor in bioinformatics.
              </p>
              <p>
                Previously pre-dental, I eventually made up my mind to pursue my
                passion for software development and switched into tech during
                my 4th year of college.
              </p>
              <p>
                Over the years, I’ve explored and completed personal projects in
                many areas including:
              </p>
              <ul className="ul-indented">
                <li key="0">Data Science / Deep Learning</li>
                <li key="1">Web Development</li>
                <li key="2">Web Scraping and Automation</li>
                <li key="3">Game Development</li>
              </ul>
              <p>
                I am currently searching for a software developer position where
                I can utilize my broad skillset, curiosity, and resourcefulness
                to deliver and create value for the team.
              </p>
            </div>
          </div>
          <div
            className={"container " + anim("fade", inView4)}
            style={animDelay(0.7)}
            ref={ref4}
          >
            <h2>skills</h2>
            <div className="divider"></div>
            <ul className="ul-unindented">
              <li key="0">
                Machine Learning/Data Science — Python, PyTorch, Tensorflow,
                Scikit-learn, Numpy, Pandas, Matplotlib, Seaborn, OpenCV,
                Pillow, Selenium, BeautifulSoup
              </li>
              <li key="1">
                Full Stack — Javascript, CSS, HTML5, React.js, Axios,
                Express.js, Sequelize, Fly.io, Flask, Microservices
              </li>
              <li key="2">Database — PostgreSQL, MySQL</li>
              <li key="3">
                Containerization — Docker, Docker Compose, Kubernetes
              </li>
              <li key="4">Cloud — GCP</li>
              <li key="5">CI/CD — Jenkins, Gitlab, Git</li>
            </ul>
          </div>
          <div className="flex justify-between gap-3">
            {/* <div
              ref={ref4}
              className={"container max-w-min " + anim("fade", inView4)}
              style={animDelay(0.5)}
            >
              <h2>languages</h2>
              <div className="divider"></div>
              <ul>
                <li key="0">Python</li>
                <li key="1">Javascript</li>
                <li key="2">Java</li>
                <li key="3">C++</li>
              </ul>
            </div> */}

            {/* <div
              className={"container " + anim("fade", inView4)}
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
            </div> */}
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
            path={require("../images/github-mark-white.png")}
            alt="github logo"
          />
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.4)}
            href="https://www.linkedin.com/in/paul-gan-85781b18b/"
            title="linkedin"
            path={require("../images/linkedin-logo.png")}
            alt="linkedin logo"
          />
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.6)}
            href="https://www.instagram.com/paulypavilion/"
            title="instagram"
            path={require("../images/instagram-logo.png")}
            alt="instagram logo"
          />
          <FlipCard
            classes={anim("slideLeft", inView5)}
            style={animDelay(0.8)}
            href="mailto:paulgan98@gmail.com"
            title="email"
            path={require("../images/email-logo.png")}
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
