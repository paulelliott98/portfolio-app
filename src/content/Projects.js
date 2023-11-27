const projects = [
  {
    listName: 'snake',
    name: 'Snake',
    techStack: [
      'Javascript',
      'React',
      'Axios',
      'Express',
      'Sequelize',
      'PostgreSQL',
      'Docker',
      'Jenkins',
    ],
    dx:
      "A full-stack JavaScript snake game that utilizes HTML canvas and interpolation to create fluid movement. In addition, the game has a leaderboard that displays the top 10 players' high scores. The scores are stored in and retrieved from a PostgreSQL database, allowing players to compete with each other for the top spot. ",
    gitUrl: 'https://github.com/paulgan98/portfolio-app',
  },
  {
    listName: 'polygon detection',
    name: 'Canvas with Polygon Detection',
    techStack: ['Python', 'Tkinter'],
    dx: [
      'As part of an effort to create pigeon art in Dr. Blaisdell’s lab at UCLA, this project showcases an implementation of the algorithm for extracting the regions of a planar graph described in a ',
      <a
        className="link"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.sciencedirect.com/science/article/abs/pii/016786559390104L"
      >
        paper
      </a>,
      ' by  X.Y. Jiang and H. Bunke (1993). Polygons are filled in with various colors as intersecting line segments are drawn onto the canvas.',
    ],
    gitUrl: 'https://github.com/paulgan98/polygon-detection',
  },
  {
    listName: 'browser game bot',
    name: 'Browser Game Bot',
    techStack: ['Python', 'Pandas', 'Pytesseract', 'OpenCV', 'Selenium'],
    dx:
      'A program that automatically performs clicks or key inputs in game between set time intervals. It is able to solve captcha challenges by cleaning up noise and then converting text in the captcha image into string format using Pytesseract. This was my first project using Selenium and Chromedriver and my first time working with web elements. I will not be sharing the code to avoid disclosing any details about the game.',
    gitUrl: '',
  },
  {
    listName: 'interactive prime spiral',
    name: 'Interactive Prime Spiral',
    techStack: ['Javascript', 'React'],
    dx: [
      'The prime or Ulam spiral is a visual depiction of prime numbers on an integer number line drawn in a square spiral shape, where every prime integer is marked with a dot. I implemented a HTML canvas with pan and zoom to help visualize the beautiful and enigmatic patterns in the spiral.',
      '\n',
      ' Check it out ',
      <a
        className="link"
        target="_blank"
        rel="noopener noreferrer"
        href="https://paulgan98.github.io/prime-spiral/"
      >
        here
      </a>,
      '!',
    ],
    gitUrl: 'https://github.com/paulgan98/prime-spiral',
  },
  {
    listName: 'connect four',
    name: 'Connect Four',
    techStack: ['Python'],
    dx:
      'A console game with AI opponent implementing the minimax algorithm with alpha-beta pruning. While not completely unbeatable, the AI is capable of putting up a very good fight. The game is entirely rendered with text and made for the MacOS terminal.',
    gitUrl: 'https://github.com/paulgan98/connect4',
  },
];

export default projects;
