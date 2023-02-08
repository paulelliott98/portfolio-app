import React from "react";

// reusable component for projects
export default function Project({ techStack, name, dx, gitUrl }) {
  return (
    <section>
      <h2>{name}</h2>
      <div className="divider"></div>
      <p>{dx}</p>
      <div className="tech-stack-container">
        {techStack.map((item) => (
          <div className="tech-item-div">
            <h3>{item}</h3>
          </div>
        ))}
      </div>

      {gitUrl === "" ? null : (
        <a
          className="github-logo-container inline-block"
          href={gitUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="github-logo"
            title="github"
            src={require("./images/github-mark-white.png")}
            alt="github logo"
          />
        </a>
      )}
    </section>
  );
}
