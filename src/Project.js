import React from "react";

// reuseable component for projects
export default function Project({ codingLang, name, dx, gitUrl }) {
  return (
    <section>
      <h3>{codingLang}</h3>
      <h2>{name}</h2>
      <div class="divider"></div>
      <p>{dx}</p>
      <div class="mt-5">
        <a href={gitUrl} target="_blank" rel="noopener noreferrer">
          <img
            class="github-logo"
            title="github"
            src={require("./images/github-mark-white.png")}
            alt="github logo"
          />
        </a>
      </div>
    </section>
  );
}
