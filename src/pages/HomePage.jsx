import React, { useState, useEffect, useMemo } from 'react';
import '../styles.css';
import Project from '../components/Project';
import FlipCard from '../components/FlipCard';
import { useInView } from 'react-intersection-observer';
import projects from '../content/Projects';
import 'animate.css';
import { Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import AnimateFlowInText from '../components/Typography/AnimateFlyIn';
import StyledChip from '../components/StyledChip';
import Planet from '../components/Background/Planet';

const utils = require('../utils');
const { parseList } = utils;

export default function HomePage({ isSmallScreen, ...props }) {
  const [active, setActive] = useState(0);
  const [ref] = useInView({ triggerOnce: true }); // intro
  const [ref2, inView2] = useInView({ triggerOnce: true }); // projects
  const [ref3] = useInView({ triggerOnce: true }); // about bio
  const [ref4] = useInView({ triggerOnce: true }); // about skills
  const [ref5, inView5] = useInView(); // contact

  // animations
  const anim = (type, view) => {
    var animIn = '';
    var animOut = '';
    switch (type) {
      case 'slideLeft':
        animIn = 'animate__animated animate__fadeInLeft animate__fast';
        animOut = 'fadeOut';
        // animIn = 'slideLeft 0.8s ease forwards';
        // animOut = 'slideLeft 0.8s ease backwards';
        break;
      case 'slideRight':
        animIn = 'animate__animated animate__fadeInRight animate__faster';
        animOut = 'animate__animated animate__fadeOutRight animate__faster';
        break;
      case 'slideUp':
        animIn = 'animate__animated animate__fadeInUp animate__fast';
        animOut = 'animate__animated animate__fadeOutUp animate__fast';
        break;
      case 'slideDown':
        animIn = 'animate__animated animate__fadeInDown animate__fast';
        animOut = 'animate__animated animate__fadeOutDown animate__fast';
        break;
      case 'fade':
        animIn = 'fadeIn';
        animOut = 'fadeOut';
        break;
      default:
        break;
    }

    return view ? animIn : animOut;
  };

  // add animation delay in style
  const animDelay = (delay) => {
    return {
      animationDelay: `${delay}s`,
    };
  };

  const handleDisplay = (e, i) => {
    e.preventDefault();
    if (active !== i) {
      const newAnimate = projects.map(() => false);
      newAnimate[i] = true;
      setActive(i);
    }
  };

  const getDocumentHeight = props.getDocumentHeight;

  useEffect(() => {
    getDocumentHeight(utils.getPageHeight(document));
  }, [getDocumentHeight]);

  const renderChips = (array) => {
    return (
      <Grid item container sx={{ gap: '12px' }}>
        {array.map((item) => (
          <StyledChip key={item} label={item} />
        ))}
      </Grid>
    );
  };

  const renderProjects = useMemo(() => {
    return projects.map((p, index) => (
      <Project
        key={index}
        techStack={p.techStack}
        name={p.name}
        dx={p.dx}
        gitUrl={p.gitUrl}
      />
    ));
  }, []);

  return (
    <Grid
      item
      container
      className="content"
      sx={{ flexFlow: 'column nowrap', alignItems: 'center' }}
    >
      <Planet />
      <section key="0" className="scroll-window-full" id="home">
        <Grid item container sx={{ flexFlow: 'row nowrap', gap: '8px' }}>
          <Grid item container className="intro-container" ref={ref}>
            <Typography
              variant="h1"
              sx={{
                opacity: 0,
                animation: 'slideLeft 0.6s ease forwards',
              }}
            >
              Paul Gan
            </Typography>
            <AnimateFlowInText
              animationDelayMs={400}
              animationDurationMsTotal={1000}
              style={{ marginTop: '16px' }}
            >
              <Typography
                variant="h2"
                style={{
                  display: 'inline-flex',
                }}
              >
                I am a full stack developer with a passion for creating
                beautiful, pixel-perfect digital experiences
              </Typography>
            </AnimateFlowInText>
          </Grid>
        </Grid>
      </section>
      <section key="projects" className="scroll-window" id="projects">
        <div className="section-title">
          <h4>projects</h4>
        </div>
        <Grid
          item
          container
          justifyContent="center"
          ref={ref2}
          sx={{ gap: '32px', marginTop: '48px' }}
        >
          <div className="projects-list">
            {projects.map((p, index) => (
              <a
                key={index}
                className={anim('slideLeft', inView2)}
                style={{
                  ...{
                    color: active === index ? 'var(--heading-color-main)' : '',
                    textShadow: active === index ? '0 0 10px #902cce' : '',
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
            className={'project-container ' + anim('fade', inView2)}
            style={{ ...animDelay(0.8) }}
          >
            {renderProjects[active]}
          </div>
        </Grid>
      </section>

      <section key="about" className="scroll-window" id="about">
        <div className="section-title">
          <h4>about me</h4>
        </div>
        <Grid item container ref={ref3}>
          <Typography gutterBottom>
            Hello and welcome to my space on the internet! (Get it?) Through my
            website, I hope to convey my love for and, ideally, expertise in
            building awesome web apps and software development in general. My
            aim is to improve upon this website with each update as I take my
            design and web dev skills to the next level. Oh, and if you notice
            any typos, my cats did it. 😀
          </Typography>
          <Typography gutterBottom>
            I graduated UCLA in 2022 with a molecular, cell, and development
            biology major and bioinformatics minor. Go Bruins! 🐻 Previously
            pre-dental, I eventually decided to pursue my passion for software
            development and switched my career path during my 4th year in
            college. You could consider me self-taught, although I did complete
            several college computer science classes including Computer Science
            I (CS31), Computer Science II (CS32), Algorithms and Complexity
            (CS180), Data Science (M148), Machine Learning in Genetics (CM124),
            Algorithms in Bioinformatics (CM122), and Digital Imaging and
            Processing (M130), as well as related math classes including Linear
            Algebra (Math 33A), Differential Equations (Math 33B), and Discrete
            Structures (Math 61).
          </Typography>
          <Typography>
            One fact about me is that I enjoy working on interesting or fun side
            projects during my free time. I’ve explored several areas in these
            projects including:
          </Typography>
          <Grid item container sx={{ margin: 0 }}>
            <List
              sx={{
                listStyleType: 'square',
                pl: 4,
                '& .MuiListItem-root': {
                  display: 'list-item',
                },
              }}
            >
              <ListItem>
                <ListItemText primary="Full stack web development" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Data science and deep learning" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Web scraping and browser automation" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Game development" />
              </ListItem>
            </List>
          </Grid>
          <Typography gutterBottom>
            During my free time, you'll usually find me playing tennis 🎾 and
            coding up my next billion-dollar project idea 😆
          </Typography>
        </Grid>
      </section>
      <section
        key="technical-skills"
        className="scroll-window"
        id="technical-skills"
      >
        <div className="section-title">
          <h4>technical skills</h4>
        </div>
        <Grid ref={ref4} container sx={{ flexDirection: 'column', gap: '3em' }}>
          <Grid item container>
            <Typography gutterBottom variant="h5">
              Data Science and Machine Learning
            </Typography>
            {renderChips(
              parseList(
                `Python, PyTorch, Tensorflow, Scikit-learn, Numpy, Pandas, Matplotlib, Seaborn, OpenCV, Pillow, Selenium, BeautifulSoup`
              )
            )}
          </Grid>
          <Grid item container>
            <Typography gutterBottom variant="h5">
              Full Stack
            </Typography>
            {renderChips(
              parseList(
                `Javascript, Typescript, CSS, HTML, React.js, Next.js, Chart.js, Three.js, Redux, Material UI, REST APIs, GraphQL, Express, Jest, Cypress, Flask, AWS`
              )
            )}
          </Grid>
          <Grid item container>
            <Typography gutterBottom variant="h5">
              Databases
            </Typography>
            {renderChips(parseList(`PostgreSQL, MongoDB, MySQL`))}
          </Grid>
          <Grid item container>
            <Typography gutterBottom variant="h5">
              CI/CD
            </Typography>
            {renderChips(parseList(`Git, Jenkins`))}
          </Grid>
        </Grid>
      </section>

      <section key="3" className="scroll-window" id="contact">
        <div className="section-title">
          <h4>get in touch</h4>
        </div>
        <div ref={ref5}></div>
        <div className="flip-card-container">
          <FlipCard
            key="0"
            classes={anim('slideLeft', inView5)}
            style={{
              opacity: 0,
              animationDelay: '0.2s',
            }}
            href="https://github.com/paulgan98"
            title="github"
            path={require('../images/github-mark-white.png')}
            alt="github logo"
          />
          <FlipCard
            key="1"
            classes={anim('slideLeft', inView5)}
            style={{
              opacity: 0,
              animationDelay: '0.4s',
            }}
            href="https://www.linkedin.com/in/paul-gan-85781b18b/"
            title="linkedin"
            path={require('../images/linkedin-logo.png')}
            alt="linkedin logo"
          />
          <FlipCard
            key="2"
            classes={anim('slideLeft', inView5)}
            style={{
              opacity: 0,
              animationDelay: '0.6s',
            }}
            href="https://www.instagram.com/paulypavilion/"
            title="instagram"
            path={require('../images/instagram-logo.png')}
            alt="instagram logo"
          />
          <FlipCard
            key="3"
            classes={anim('slideLeft', inView5)}
            style={{
              opacity: 0,
              animationDelay: '0.8s',
            }}
            href="mailto:paulgan98@gmail.com"
            title="email"
            path={require('../images/email-logo.png')}
            alt="email logo"
          />
        </div>
      </section>
      <footer>
        <Grid item container justifyContent="center">
          <Typography variant="body1" sx={{ fontSize: 'inherit' }}>
            A React app designed and built by Paul Gan
          </Typography>
        </Grid>
      </footer>
    </Grid>
  );
}
