import React from "react";

export default function FlipCard({ classes, style, href, title, path, alt }) {
  return (
    <div class={"flip-card " + classes || ""} style={style}>
      <a
        class="logo-container"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="flip-card-inner">
          <img class="logo" title={title} src={path} alt={alt} />
          <div class="flip-card-back">
            {/* <h5 class="mt-4">{title}</h5> */}
            <p class="mt-4">{title}</p>
          </div>
        </div>
      </a>
    </div>
  );
}
